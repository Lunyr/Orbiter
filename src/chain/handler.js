/**
 * This is the job script.  It pulls jobs from the queue
 */
import { settings } from '../shared/settings';
import { getLogger, Raven } from '../lib/logger';
import eventsQueue from './queue';
import { getEventData, getTransaction, getTransactionReceipt } from './utils'
import { addEvent, addTx } from '../backend/api';
import { TxState, TxTypeTranslation } from '../shared/constants';

const log = getLogger('handler');

/**
 * @dev loadHandler will require() handler modules only when they haven't 
 *  already been loaded
 * @param {string} name is the name of the handler
 */
let LOADED_HANDLERS = {};
const loadHandler = (name) => {
  try {
    if (typeof LOADED_HANDLERS[name] === 'undefined') {
      LOADED_HANDLERS[name] = require(`./handlers/${name}`).default;
    }
    return LOADED_HANDLERS[name];
  } catch (err) {
    log.error({ error: err.message }, "Error loading handler!");
    if (!settings.isDevelopment && typeof process.env.DEBUG === 'undefined') Raven.captureException(err);
    else console.log(err);
  }
}

// The handlers we will use
const HANDLERS = [
  'ProposalSubmitted',
  'VoteOccurred',
  'ProposalRejected',
  'ProposalAccepted',
  'ProposalExpired',
  'IneligibleCreator',
  'IneligibleVoter',
  'IneligibleEditor',
  'ClosedForVote',
  'ClosedForEdit',
  'SuccessfulBid',
  'SuccessfulBidRange',
  'NotBiddable',
  'NotBiddableRange',
  'CBNBurned',
  'HNRBurned',
  'SuccessfulWithdrawal',
  'WithdrawalAttemptFailedTooMuch',
  'WithdrawalAttemptFailedTransferFailure',
  'WithdrawalAttemptFailedTooEarly',
  'TagProposed',
  'TagActivated',
  'TagAssociated',
  'TagDisassociated',
];

/**
 * @dev eventRouter is provided with a job from the queue and tries to send
 *  it to the appropriate handler.  It will load and use any handler listed in 
 *  HANDLERS.
 * @param {object} job is the object returned from Bull
 * @param {function} done is the callback given by queue.process
 */
const eventRouter = async (job) => {
  // Make sure to send any job problem to Sentry
  try {
    const eventName = job.data.event.name;
    log.debug({ eventName: eventName }, 'Event at router');
    if (HANDLERS.indexOf(eventName) > -1) {
      log.debug("Event known");

      // Assemble event object
      const evData = getEventData(job.data.event);
      const txHash = job.data.txHash;

      // Add event to the DB
      try {
        await addEvent({
          contract_address: job.data.address,
          transaction_hash: txHash,
          log_index: parseInt(job.data.logIndex),
          block_number: parseInt(job.data.blockNumber),
          name: job.data.event.name,
          args: JSON.stringify(evData),
        });
      } catch (err) {
        // if the error isn't about a duplicate event in the DB, throw it
        if (err.message.indexOf('UNIQUE') < 0) {
          throw err;
        }
      }

      // Add tx to the DB
      const txFromChain = await getTransaction(txHash);
      if (txFromChain) {
        const receiptFromChain = await getTransactionReceipt(txHash);
        if (!receiptFromChain) {
          throw new Error(`Unable to get the receipt for ${txHash}`);
        }
        let txToStore = { 
          hash: txHash,
          nonce: txFromChain.nonce,
          from_address: txFromChain.from,
          to_address: txFromChain.to,
          gas: parseInt(txFromChain.gas),
          gas_price: parseInt(txFromChain.gasPrice),
          gas_used: parseInt(receiptFromChain.gasUsed),
          block_number: parseInt(receiptFromChain.blockNumber),
          value: parseInt(txFromChain.value),
          data: txFromChain.input,
          status: receiptFromChain.status ? parseInt(receiptFromChain.status) : null,
          transaction_state_id: TxState.SUCCESS,
        };
        if (typeof TxTypeTranslation[job.data.event.name] !== 'undefined') {
          txToStore.transaction_type_id = TxTypeTranslation[job.data.event.name];
        }
        /**
         * Generally speaking, we should never be inserting twice, but there are 
         * edge cases where a failed job is restarted due to a handler bug and this
         * can occur.
         */
        try {
          const txResult = await addTx(txToStore);
          if (!txResult.success) {
            throw new Error(txResult.error);
          }
        } catch (err) {
          // Only throw non-unique errors
          if (err.message.indexOf('UNIQUE') < 0) {
            throw err;
          }
        }
      } else {
        log.error({ txHash }, "Unable to find transaction for event in DB or on chain.");
      }

      // Load the handler
      let handler = loadHandler(eventName);

      if (!handler) {
        throw new Error(`Unable to load handler for ${eventName}`);
      }

      // Have the handler process the job
      const handlerResult = await handler(job, txHash, evData);
      return handlerResult;

    } else {
      log.warn({ event: job.data.event.name }, "Event without handler!");
      throw new Error('No handler for this job');
    }
  } catch (err) {
    // Make sure we know about this error
    log.error({ error: err.message }, "Unhandled error in a handler!");
    if (!settings.isDevelopment && typeof process.env.DEBUG === 'undefined') Raven.captureException(err);
    else console.log(err);
    // Make sure the queue knows this errored
    throw err;
  }
};

/**
 * @dev init kicks off the whole job consumer
 * @return {Promise} is a promise that will never resolve, nor reject
 */
export default () => {
  return new Promise(async (resolve,reject) => {
    try {
      await eventsQueue.process(eventRouter);
    } catch (err) {
      throw err;
    }
  });
};
