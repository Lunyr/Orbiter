import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import fetch from 'node-fetch';
import { settings } from '../../shared/settings';
import { getLogger } from '../../lib/logger';
import { privToAddress } from '../../lib/accounts';
import { initRouter, initContract } from '../../shared/contracts';
import { fromWei, lunyrConversion, parseIntWithRadix } from '../../shared/utils';

const log = getLogger('api-web3');

/**
 * Adds the 0x hex prefix to a string, if it doesn't exist
 * @param {string} hexString is the target string
 * @returns {string} the presumably hex string with the prefix
 */
const addHexPrefix = (hexString) => {
  if (hexString.slice(0, 2) !== '0x') {
    return `0x${hexString}`;
  }
  return hexString;
};

/**
 * Removes the 0x hex prefix from a string, if it exists
 * @param {string} hexString is the target string
 * @returns {string} the presumably hex string without the prefix
 */
const removeHexPrefix = (hexString) => {
  if (hexString.slice(0, 2) === '0x') {
    return hexString.slice(2);
  }
  return hexString;
};

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
 * signTransaction will sign a transaction JS object with a provided key
 * @param {string} privKey - The hex string of the private key from the SS file
 * @param {object} txObj - The JS object of an Ethereum trnasaction
 * @returns {object} Returns a signed ethereumjs-tx transaction object
 */
const signTransaction = async (privKey, txObj) => {
  if (
    typeof txObj.to === 'undefined' ||
    typeof txObj.from === 'undefined' ||
    typeof txObj.data === 'undefined'
  ) {
    log.error({ tx: txObj }, 'Transaction malformed');
    throw new Error('Missing something from transaction!');
  }

  // No prefix for where we're going
  const privKeyBuff = new Buffer(removeHexPrefix(privKey), 'hex');

  // Generate the nonce if it wasn't provided
  if (typeof txObj.nonce === 'undefined') {
    txObj.nonce = await global.web3.eth.getTransactionCount(txObj.from, 'pending');
  }

  // Sign the TX and return the transaction object
  const tx = new Tx(txObj);
  tx.sign(privKeyBuff);
  return tx;
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
    ]).catch((err) => {
      log.error({ err }, 'There was an error while initailizing the contracts');
      throw err;
    });

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

const getUSDConversion = async (coin = 'ethereum') =>
  fetch(`https://api.coinmarketcap.com/v1/ticker/${coin}/`)
    .then((res) => res.json())
    .then((json) => {
      console.log('got me some usd conversion for lun', json);
      if (json && json[0].id === coin) {
        return json[0].price_usd;
      }
    })
    .catch((error) => {
      console.error(error);
      return 1;
    });

const fetchAccountInformation = async (address) => {
  try {
    if (!address) {
      throw new Error('Error fetching account information with no address provided');
    }

    // Reference web3 and contracts we need
    const {
      web3: {
        eth,
        utils: { asciiToHex },
      },
      contracts: { contributors, environment, lunyrToken, lunPool },
    } = global;

    // Run calls in parallel
    const [ethereum, lunyr, hp, cp, pool, totalCp] = await Promise.all([
      // Eth balance
      eth.getBalance(address).then(fromWei),
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
      // Total CP
      contributors.methods.getTotalCBN().call(),
    ]);

    // Fetch environment information
    // TODO: May want to consider just caching the result here
    const [
      majorityVoteCpReward,
      minorityVoteCpPunishment,
      majorityVoteHpReward,
      minorityVoteHpPunishment,
      createCpReward,
      editCpReward,
      rejectCpPunishment,
      createHpReward,
      editHpReward,
      rejectHpPunishment,
    ] = await Promise.all([
      environment.methods
        .getValue(asciiToHex('majorityVoteCBNReward'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('minorityVoteCBNPunishment'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('majorityVoteHNRReward'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('minorityVoteHNRPunishment'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('createCBNReward'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('editCBNReward'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('rejectCBNPunishment'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('createHNRReward'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('editHNRReward'))
        .call()
        .then(parseIntWithRadix),
      environment.methods
        .getValue(asciiToHex('rejectHNRPunishment'))
        .call()
        .then(parseIntWithRadix),
    ]);

    const lunToUsd = await getUSDConversion('lunyr');

    return {
      success: true,
      data: {
        address,
        balances: {
          ethereum,
          lunyr,
        },
        conversion: {
          lunToUsd: parseFloat(lunToUsd),
        },
        rewards: {
          cp,
          hp,
          pool: pool / 1e18,
          totalCp,
        },
        environment: {
          majorityVoteCpReward,
          minorityVoteCpPunishment,
          majorityVoteHpReward,
          minorityVoteHpPunishment,
          createCpReward,
          editCpReward,
          rejectCpPunishment,
          createHpReward,
          editHpReward,
          rejectHpPunishment,
        },
      },
    };
  } catch (err) {
    console.error(err);
    const errorMessage = `There was an error while fetching account information linked to address ${address}`;
    log.error({ address, err }, errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

const normalizeTransaction = (transactionObject, data, to) => ({
  ...transactionObject,
  // Convert gwei to wei string
  // TODO: Everything should be in wei so these rounding errors don't happen
  gasPrice: Math.floor(transactionObject.gasPrice * 1e9),
  data,
  to,
});

const signedTransaction = async (privKey, txObj) => {
  const signedTx = await signTransaction(privKey, txObj);
  const encodedTx = addHexPrefix(signedTx.serialize().toString('hex'));
  const transactionHash = addHexPrefix(signedTx.hash().toString('hex'));
  return {
    signedTx,
    encodedTx,
    transactionHash,
  };
};

const createAd = async (contentHash, transactionObject, privKey) => {
  try {
    const {
      web3,
      contracts: { auctioneer, lunyrToken },
    } = global;

    // Gets the time period in days by subtracting start date from current day
    const timePeriodInDays =
      new Date(transactionObject.endsOn - transactionObject.startsOn).getUTCDate() - 1; //ad runs for one day
    const timePeriodInAdPeriods = Math.floor(timePeriodInDays / transactionObject.adPeriodInDays);
    const lunAmount = Math.floor((transactionObject.bidValueLUN * 1e9) / timePeriodInAdPeriods);

    const startDate = new Date(0);
    startDate.setUTCSeconds(transactionObject.startTime.toString());
    let startPeriod = Math.abs(transactionObject.startsOn.getTime() - startDate.getTime());
    startPeriod = Math.ceil(startPeriod / (1000 * 3600 * 24));

    log.info(
      'lunyrToken',
      lunyrToken,
      timePeriodInDays,
      timePeriodInAdPeriods,
      lunAmount,
      startPeriod
    );

    // Approve the lun token being spent
    const approveData = await lunyrToken.methods.approve().encodeABI();
    const approveTo = auctioneer.options.address;

    // Sign the tx
    const { encodedTx, transactionHash } = await signedTransaction(
      privKey,
      normalizeTransaction(transactionObject, approveData, approveTo)
    );

    // Send it
    web3.eth.sendSignedTransaction(encodedTx).then((receipt) => {
      log.info({ transactionHash: receipt.transactionHash }, 'Transaction mined');
    });

    log.info({ transactionHash }, 'Successfully proposed new proposal content');

    return {
      success: true,
      data: {
        transactionHash,
      },
    };
  } catch (err) {
    console.error(err);
    log.error({ err }, `There was an error publishing an ad ${contentHash}`);
    return {
      success: false,
      error: err.message,
    };
  }
};

const publishProposal = async (contentHash, transactionObject, privKey) => {
  try {
    const {
      web3,
      contracts: { peerReview },
    } = global;

    const data = await peerReview.methods.proposeNewContent(contentHash).encodeABI();
    const to = peerReview.options.address;
    const convertedTransactionObject = normalizeTransaction(transactionObject, data, to);

    log.info(
      { account: privToAddress(privKey), contentHash, txObj: convertedTransactionObject },
      'Attempting to publish proposal'
    );

    // Sign the tx
    const { encodedTx, transactionHash } = await signedTransaction(
      privKey,
      convertedTransactionObject
    );

    // Send it
    web3.eth.sendSignedTransaction(encodedTx).then((receipt) => {
      log.info({ transactionHash: receipt.transactionHash }, 'Transaction mined');
    });

    log.info({ transactionHash }, 'Successfully proposed new proposal content');

    return {
      success: true,
      data: {
        transactionHash,
      },
    };
  } catch (err) {
    console.error(err);
    log.error({ err }, `There was an error publishing a proposal ${contentHash}`);
    return {
      success: false,
      error: err.message,
    };
  }
};

const voteOnProposal = async ({ accepted, proposalId, ipfsHash }, transactionObject, privKey) => {
  try {
    const {
      web3,
      contracts: { peerReview },
    } = global;

    const data = await peerReview.methods.vote(proposalId, accepted, ipfsHash).encodeABI();
    const to = peerReview.options.address;
    const convertedTransactionObject = normalizeTransaction(transactionObject, data, to);

    log.info(
      {
        account: privToAddress(privKey),
        proposalId,
        accepted,
        txObj: convertedTransactionObject,
      },
      'Attempting to vote on proposal'
    );

    // Sign the tx
    const { encodedTx, transactionHash } = await signedTransaction(
      privKey,
      convertedTransactionObject
    );

    // Send it
    web3.eth.sendSignedTransaction(encodedTx).then((receipt) => {
      log.info({ transactionHash: receipt.transactionHash }, 'Transaction mined');
    });

    log.info({ transactionHash }, 'Successfully proposed vote on proposal');

    return {
      success: true,
      data: {
        transactionHash,
      },
    };
  } catch (err) {
    log.error({ err }, `There was an error voting on proposal ${proposalId}`);
    return {
      success: false,
      error: err.message,
    };
  }
};

export default {
  connect,
  fetchAccountInformation,
  initializeContracts,
  createAd,
  publishProposal,
  voteOnProposal,
};
