import Web3 from 'web3';
import { settings } from '../../shared/settings';
import { getLogger } from '../../lib/logger';
import { initRouter, initContract } from '../../shared/contracts';
import { fromWei, lunyrConversion } from '../../shared/utils';

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
    const network = await web3.eth.net.getNetworkType();

    log.info({ connected, providerUrl, network }, 'Blockchain connection status');

    // Set into global context - This cant just be passed as data because
    // it wont serialize the functions appropriately across ipc
    global.web3 = web3;

    return {
      success: true,
      data: {
        network,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Initializes a set of contracts against a particular network
 * @param network
 * @returns {Promise<*>}
 */
const initializeContracts = async (network) => {
  try {
    log.info({ network }, 'Initializing contracts against network');

    const router = await initRouter();

    const allContracts = await Promise.all([
      initContract(router, 'PeerReview'),
      initContract(router, 'Auctioneer'),
      initContract(router, 'LunyrToken'),
      initContract(router, 'Contributors'),
      initContract(router, 'LunPool'),
      initContract(router, 'Environment'),
      initContract(router, 'Tagger'),
    ]);

    const [
      peerReview,
      auctioneer,
      lunyrToken,
      contributors,
      lunPool,
      environment,
      tagger,
    ] = allContracts;

    log.info('PeerReview address', peerReview.options.address);
    log.info('Auctioneer address', auctioneer.options.address);
    log.info('LunyrToken address', lunyrToken.options.address);
    log.info('Contributors address', contributors.options.address);
    log.info('Lun Pool address', lunPool.options.address);
    log.info('Environment address', environment.options.address);
    log.info('Tagger address', tagger.options.address);

    // Add into global context
    global.contracts = {
      peerReview,
      auctioneer,
      lunyrToken,
      contributors,
      lunPool,
      environment,
      tagger,
    };

    return {
      success: true,
      data: {
        network,
      },
    };
  } catch (err) {
    log.error({ err }, 'There was an error while initailizing the contracts');
    return {
      success: false,
      error: err.message,
    };
  }
};

const fetchAccountInformation = async (address) => {
  try {
    // Reference web3 and contracts we need
    const {
      web3,
      contracts: { contributors, lunyrToken, lunPool },
    } = global;

    // Run calls in parallel
    const [ethereum, lunyr, hp, cp, pool] = await Promise.all([
      // Eth balance
      web3.eth.getBalance(address).then(fromWei),
      // Lunyr balance
      lunyrToken.methods
        .balanceOf(address)
        .call()
        .then(lunyrConversion),
      // Honor points
      contributors.methods.getHNR(address).call(),
      // Contribution points
      contributors.methods.getCBN(address).call(),
      // Pool Information
      lunyrToken.methods
        .balanceOf(lunPool.options.address)
        .call()
        .then(lunyrConversion),
    ]);

    return {
      success: true,
      data: {
        address,
        balances: {
          ethereum,
          lunyr,
        },
        rewards: {
          cp,
          hp,
          pool,
        },
      },
    };
  } catch (err) {
    console.error(err);
    const errorMessage = `There was an error while fetching account information linked to address ${address}`;
    log.error({ err }, errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export default {
  connect,
  fetchAccountInformation,
  initializeContracts,
};
