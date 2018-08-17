import Web3 from 'web3';
import { settings } from '../../shared/settings';
import { getLogger } from '../../lib/logger';

const log = getLogger('api-web3');

/**
 * Adds into the global context the web3 provider we can use across the application
 * @returns {Promise<*>}
 */
const connect = async () => {
  try {
    const providerUrl = settings.jsonRPC.current;
    const web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(providerUrl));
    const connected = await web3.eth.net.isListening();
    log.info({ connected, providerUrl }, 'Blockchain connection status');
    // Set into global context - This cant just be passed as data because
    // it wont serialize the functions appropriately
    global.web3 = web3;
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  connect,
};
