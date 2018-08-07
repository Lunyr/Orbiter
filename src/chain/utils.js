import multihashes from 'multihashes';
import fetch from 'node-fetch';
import ipfsAPI from 'ipfs-api';
import { getLogger } from '../lib/logger';
import { settings } from '../shared/settings';
import { getWatch, setWatchState } from '../backend/api';
import { TxState, TxType } from '../shared/constants';

const log = getLogger('events-utils');
const ipfs = ipfsAPI(settings.ipfs.host, settings.ipfs.port, {protocol: 'https'});
export const EMPTY_IPFS_HEX = '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6';

/**
 * getEventData parses an event that was provided by abi-decoder and creates an
 * object of event arguments
 * @param {object} ev is the event object
 * @return {object} an object with properties with argument name
 */
export const getEventData = (ev) => {
  // sanity check the event
  if (
    typeof ev.events === 'undefined'
    || !(ev.events instanceof Array)
  ) { 
    throw new Error("Not an event format I can work with");
  }

  let ret = {};
  ev.events.map((arg) => {
    ret[arg.name] = arg.value
  });
  return ret;
};

/**
 * completeTransaction will mark a transaction as completed
 */
export const completeTransaction = async (txHash, txType) => {
  // sanity check
  if (!txHash) new Error("txHash is missing");

  // check for an existing transaction watch first
  let watchResult = await getWatch({ hash: txHash });

  // If it exists, update
  if (watchResult.success) {
    // Set state to 1(complete)
    await setWatchState(txHash, TxState.SUCCESS);
  }
};

/**
 * @dev ipfsFetch retrieves a specific JSON file from IPFS
 * @param {string} hash of the file to retrieve
 * @param {number} timeout, in milliseconds
 * @return {object} the JSON object that was stored in the file
 */
export const ipfsFetch = (hash, duration) => {
  if (!hash || hash === '0x') throw new Error("Hash not provided");
  duration = duration ? duration : 15000; // default 15 seconds
  return new Promise(async (resolve, reject) => {

    log.debug({ hash: hash }, "ipfsFetch");

    if (hash.slice(0,2) === '0x') {
      hash = multihashes.toB58String(multihashes.fromHexString('1220' + hash.slice(2)));
    }

    log.debug({ hash: hash }, "ipfsFetch");

    const timeout = setTimeout(() => {
      log.warn({ hash, duration }, "IPFS fetch timeout reached!");
      return reject(new Error(`IPFS fetch timed out on ${hash}`));
    }, duration);

    try {
      const encodedContent = await ipfs.files.get(hash);
      if (encodedContent.length < 1) return null;
      const file = encodedContent[0].content.toString('utf8');
      clearTimeout(timeout);
      return resolve(JSON.parse(file));
    } catch (e) {
      log.error({ err: e.message }, "Error fetching from IPFS")
      return reject(e);
    }
  });
};

/**
 * @dev getTransaction will run eth_getTransaction
 * @param {string} txHash is the has for the transaction to look up
 * @return {object} the results of the JSON-RPC query
 */
export const getTransaction = async (txHash) => {
  
  log.debug({ txHash}, "getTransaction");
  
  // Request options
  let options = {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getTransactionByHash",
      params: [txHash]
    })
  };
  
  log.debug({ options: options }, "making request to JSON-RPC...");
  
  const result = await fetch(settings.jsonRPC.current, options)
    .catch(err => { 
      log.error({ err: err }, 'error fetching from nodes'); 
      if (!settings.isDevelopment) Raven.captureException(err);
      else console.log(err);
    });
  
  if (!result) return null;

  const json = await result.json()

  log.debug(`request to JSON-RPC complete.`);

  return json.result;
};

/**
 * @dev getTransaction will run eth_getTransactionReceipt
 * @param {string} txHash is the has for the transaction to look up
 * @return {object} the results of the JSON-RPC query
 */
export const getTransactionReceipt = async (txHash) => {
  
  log.debug({ txHash }, "getTransactionReceipt");
  
  // Request options
  let options = {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getTransactionReceipt",
      params: [txHash]
    })
  };
  
  log.debug({ options: options }, "making request to JSON-RPC...");
  
  const result = await fetch(settings.jsonRPC.current, options)
    .catch(err => { 
      log.error({ err: err }, 'error fetching from nodes'); 
      if (!settings.isDevelopment) Raven.captureException(err);
      else console.log(err);
    });
  
  if (!result) return null;

  const json = await result.json()

  log.debug(`request to JSON-RPC complete.`);

  return json.result;
};

/**
 * @dev getBlockByNumber will run eth_getBlockByNumber
 * @param {number/Array} blockNo is the block number to retreive
 * @return {object} the results of the JSON-RPC query
 */
export const getBlockByNumber = async (blockNo) => {
  
  log.debug({ blockNo }, "getBlockByNumber");
  
  // Request options
  let options = {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBlockByNumber",
      params: [blockNo, false]
    })
  };
  
  log.debug({ options: options }, "making request to JSON-RPC...");
  
  const result = await fetch(settings.jsonRPC.current, options)
    .catch(err => { 
      log.error({ err: err }, 'error fetching from nodes'); 
      if (!settings.isDevelopment) Raven.captureException(err);
      else console.log(err);
    });
  
  if (!result) return null;

  const json = await result.json()

  log.debug({ json }, `request to JSON-RPC complete.`);

  return json.result;
};
