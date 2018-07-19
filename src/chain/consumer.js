/**
 * This is the event consumer script.  It pulls events from the blockchain and
 * inserts jobs into the queue for event handlers to process.
 *
 * Usage: 
 * const consumer = require('./consumer.js');
 * consumer.init().then(...).catch(...);
 */
import fetch from 'node-fetch';
import Web3 from 'web3';
import multihashes from 'multihashes';
import ipfsAPI from 'ipfs-api';
import abiDecoder from 'abi-decoder';
import { getLogger, Raven } from '../lib/logger';
import utils from './utils';
import queueLite from '../lib/queuelite';
import settings from '../shared/settings';

const log = getLogger('consumer');
const ipfs = ipfsAPI(settings.ipfs.host, settings.ipfs.port, {protocol: 'http'});

// Configure web3
const web3 = new Web3(
  new Web3.providers.HttpProvider(settings.jsonRPC.current)
);

// A block number representing first blocks since contract deployment
const originBlock = settings.isDevelopment ? '0x0' : '0x41736a';

// Whether or not a fetch is currently in progress
let FETCH_IN_PROGRESS = {};

const IGNORE_CONTRACTS = [
  '0x2b88b7c1f40cbd59344e739edbb9c5630af2bbcb', // Tagger testnet (bug)
  '0x045f938bd53f87d745938fdb7c36af3a228494b7', // Tagger testnet (bug)
  '0xac1131decdc72bec9cda8ba4a039fd8be40221a0', // Tagger testnet (bug)
  '0xebf4978fda445ec749994bb6e23742198c67f942', // Tagger testnet (bug)
  '0x844b6ee37358ba42918eb4dac63df25e06d8fbdd', // Tagger testnet (bug)
];

/**
 * Get the addresses and ABI for a Lunyr contract from our router contract
 * @param {object} router is the initialized contract instance of the router contract
 * @param {string} name is the name of the contract we're getting the instances for
 * @return {Array} - Array of objects that contain the address and ABi for each instance
 */
const getContractInstances = async (router, name) => {

  const counts = await router.methods.getTargetCount(name.toLowerCase()).call();
  let targets = new Array();
  
  if (counts == 0) {
    const networkId = await web3.eth.net.getId();
    log.error({ 
      server: settings.jsonRPC.current, 
      networkId, 
      routerAddress: settings.router.addresses[networkId] 
    }, `No ${name} contracts found with router!`);
  } else {
    log.debug(`Router has ${counts} ${name} contracts.`);
  }

  for (let i=0; i<counts; i++) {
    const result = await router.methods.getIdx(name.toLowerCase(), i).call();
    // wtf, so web3.js 1.0 uses an object with numbered props instead of an array
    const addr = result[0];
    const abiHash = result[1];
    
    if (IGNORE_CONTRACTS.indexOf(addr) < 0) {
      log.debug(`Fetching ${name.toLowerCase()} ABI ${abiHash} from ipfs`);
      try {
        const abi = await utils.ipfsFetch(abiHash, 30000);
        log.debug(`Done fetching ${name.toLowerCase()} ABI from ipfs`);
        targets.push({
          address: addr,
          abi: abi,
        })
      } catch (err) {
        log.error({ hash: abiHash, contract: name, address: addr }, "Unable to fetch ABI for contract!")
        if (!settings.isDevelopment && typeof process.env.DEBUG === 'undefined') Raven.captureException(err);
        else console.log(err);
      }
    }
  }

  return targets;
}

/**
 * @dev getAddresses retrieves the addresses from the router contract for each
 *  contract we care about.
 * @return {object} - Object of addresses with keys as contract name
 */
const getAddresses = async () => {
  const networkId = await web3.eth.net.getId();

  // Get the instance of the contract
  log.debug({ server: settings.jsonRPC.current, networkId, address: settings.router.addresses[networkId] }, "Connecting to routing contract");
  const router = new web3.eth.Contract(settings.router.abi, settings.router.addresses[networkId]);

  let targets = [].concat.apply([], await Promise.all([
    await getContractInstances(router, 'peerreview'),
    await getContractInstances(router, 'auctioneer'),
    await getContractInstances(router, 'tagger'),
  ]));

  log.debug({ targets }, "Consumer TARGETS");

  // Get the Addresses we need
  return targets;
};

/**
 * @dev getLogs will fetch all the event logs for a contract
 * @param {object} record is an object representing a deployed contract instance
 * @param {string} fromBlock is a hex string representation of a block number to 
 *  start its log fetch from.
 * @return {Array} the results of the JSON-RPC query
 */
const getLogs = async (record, fromBlock) => {
  fromBlock = fromBlock ? fromBlock : '0x0';
  
  log.debug({ address: record.address, fromBlock: fromBlock }, "getLogs");

  if (FETCH_IN_PROGRESS[record.address])
    return null;
  else
    FETCH_IN_PROGRESS[record.address] = true;
  
  // Request options
  let options = {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getLogs",
      params: [ {
        topics:[],
        address: record.address,
        fromBlock: fromBlock,
        toBlock: "latest"
      }]
    })
  };
  
  log.debug({ options: options }, "making request to JSON-RPC...");
  
  const result = await fetch(settings.jsonRPC.current, options)
    .catch(err => { 
      log.error({ err: err }, 'error fetching from infura'); 
      if (!settings.isDevelopment && typeof process.env.DEBUG === 'undefined') Raven.captureException(err);
      else console.log(err);
    });

  FETCH_IN_PROGRESS[record.address] = false;
  
  if (!result || result.status !== 200) return null;

  const json = await result.json()

  log.debug(`request to JSON-RPC complete.`);
  log.info(`Received some logs for ${record.address}`);

  return json.result;
}

/**
 * processLogs takes in log entries pulled from the blockchain, decodes 
 *  them and creates jobs for handlers to process later.
 * @param {array} logs are the individual event log records from the blockchain
 * @param {object} queue is the Bull job queue instance to add jobs to
 */
const processLogs = (logs, queue) => {
  if (typeof logs === 'undefined' || !logs) return null;
  if (!(logs instanceof Array)) throw new Error("Logs given to processLogs are not an array");
  let eventCount = 0;
  log.debug(`Processing ${logs.length} logs`);
  for (let i=0; i<logs.length; i++) {
    try {
      const decoded = abiDecoder.decodeLogs([logs[i]])[0];
      if (decoded) {
        eventCount++;
        queue.put(
          decoded.name + ': ' + logs[i].transactionHash, 
          {
            txHash: logs[i].transactionHash,
            logIndex: logs[i].logIndex,
            blockNumber: logs[i].blockNumber,
            address: logs[i].address,
            contractAddress: logs[i].contractAddress,
            event: decoded
          }
        );
      }
    } catch (err) {
      log.error({ message: err.message, evntLog: logs[i] }, "Error decoding logs!");
      if (!settings.isDevelopment && typeof process.env.DEBUG === 'undefined') Raven.captureException(err);
      else console.log(err);
    }
  }
  if (eventCount === 0) {
    log.warn({ tx: logs[0].transactionHash }, "No logs were decoded from this tx.")
  }
};

/**
 * consumerEvents "watches" and processes new blocks from a specific 
 *  contract. 
 * @param {object} record is an object with address and abi properties 
 *  representing a specific instance of a contract
 * @param {object} queue is the Bull queue instance to store the jobs
 * @return {Promise} a fake-thread promise that should never resolve
 */
const consumeEvents = (record, queue) => {
  return new Promise((resolve,reject) => {
    let startBlock = originBlock;
    setInterval(async () => {
      try {
        const logs = await getLogs(record, startBlock);
        // TODO: set startBlock to where we need it
        processLogs(logs, queue);
      } catch (err) {
        log.error({ error: err.message }, "Unhandled error in consumeEvents()");
        if (!settings.isDevelopment && typeof process.env.DEBUG === 'undefined') Raven.captureException(err);
        else console.log(err);
      }
    }, 30000);
  });
};

/**
 * Initialize the event consumer
 * @return {Promise} - Neverending promise
 */
export default () => {
  return new Promise(async (resolve,reject) => {
    try {
      // Initialize the queue
      const eventsQueue = queueLite('events');

      // Addresses we'll be monitoring
      const addresses = await getAddresses();

      let promises = new Array();

      // get transaction logs and add them to the queue
      for (let i=0; i<addresses.length; i++) {
        // Add ABI to the decoder
        log.info({ target: addresses[i].address }, "Tracking contract address");
        abiDecoder.addABI(addresses[i].abi);
        // Start consuming the events
        promises.push(consumeEvents(addresses[i], eventsQueue));
      }

      // Run all
      Promise.all(promises);

    } catch (err) {
      log.error({ error: err.message }, "Error initializing consumer");
      reject(err);
    }
  });
};