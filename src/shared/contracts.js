import { web3 } from './web3'; 
import settings from './settings';
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

  log.debug({ abi: settings.router.abi, address: addr}, "Initializing router contract...");

  // Init the router
  let router = new web3.eth.Contract(settings.router.abi, addr);

  // Check for an upgrade path and follow it if it exists
  const nextResult = await router.methods.nextContract().call();
  if (nextResult != '0x0000000000000000000000000000000000000000') {
    log.debug({ nextContract: nextResult }, "Router switch");
    router = initRouter(nextResult);
  }
  return router;
}