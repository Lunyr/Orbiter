import fetch from 'node-fetch';
import Promise from 'bluebird';
import multihashes from 'multihashes';
import { web3 } from './web3';
import { settings } from './settings';
import { getLogger } from '../lib/logger';

const log = getLogger('contracts');

export let ROUTER = null;
export let NETWORK_ID = null;

/**
 * initRouter will initialize the router contract following any "next" addresses
 * that were set for an upgrade path.
 * @param {string} addr is an address for the contract. Generally should only be
 *    used by the function itself for recursive "next" resolution
 * @return {object} is the initialized web3 contract
 */
export const initRouter = async (addr) => {
  // Use the router already inited if available
  if ((addr && ROUTER && ROUTER.address == addr) || ROUTER) return ROUTER;

  // Get the network ID if we don't already have it
  NETWORK_ID = NETWORK_ID ? NETWORK_ID : await web3.eth.net.getId();

  // If an address was provided, use it
  addr = addr ? addr : settings.router.addresses[NETWORK_ID];

  log.debug(
    { networkId: NETWORK_ID, abi: settings.router.abi, address: addr },
    'Initializing router contract...'
  );

  // Init the router
  let router = new web3.eth.Contract(settings.router.abi, addr);

  // Check for an upgrade path and follow it if it exists
  const nextResult = await router.methods.nextContract().call();
  if (nextResult != '0x0000000000000000000000000000000000000000') {
    log.debug({ nextContract: nextResult }, 'Router switch');
    router = initRouter(nextResult);
  }
  ROUTER = router;
  return router;
};

export const ipfsFetch = async (hash) => {
  if (hash.slice(0, 2) === '0x') {
    hash = multihashes.toB58String(multihashes.fromHexString('1220' + hash.slice(2)));
  }
  return fetch(`https://ipfs.io/ipfs/${hash}`).then((res) => res.json());
};

/**
 * initContract initializes any contract that Nameth is aware of
 * @param {string} contractName is the name of the contract, as stored in Nameth
 * @param {object} router is the router instance provided by initRouter()
 * @returns {object} the instantiated contract
 */
export const initContract = async (router, contractName) => {
  // Normalize contract name
  const lowerCasedName = contractName.toLowerCase();

  log.info({ contractName }, 'Initializing contract');

  // Get contract deets from the router
  const contractData = await router.methods.get(lowerCasedName).call();
  const address = contractData[0];
  const abi = contractData[1];
  
  log.info({ address, abi }, 'Retrieved contract details from router');

  // Get the ABI from IPFS
  const qmHash = multihashes.toB58String(multihashes.fromHexString('1220' + abi.slice(2)));

  const jsonABI = await ipfsFetch(qmHash);

  log.debug({ jsonABI }, 'Retrieved jsonABI');

  if (!jsonABI) {
    throw new Error(`Error fetching ${contractName} ABI from IPFS.`);
  }

  const contract = new web3.eth.Contract(jsonABI, address);

  log.debug({ contract: !!contract, lowerCasedName }, 'Initialized a contract');

  if (contract) {
    const asyncContract = {};
    // Convert functions to promises
    Object.getOwnPropertyNames(contract).forEach(function(key) {
      if (typeof contract[key] === 'function') {
        asyncContract[key] = Promise.promisify(contract[key]);
        return;
      }
      asyncContract[key] = contract[key];
    });
    return asyncContract;
  } else {
    throw new Error(`Unknown error initializing contract ${contractName}`);
  }
};
