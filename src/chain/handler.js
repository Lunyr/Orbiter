/**
 * This is the job script.  It pulls jobs from the queue
 */
import settings from '../shared/settings';
import logger from '../lib/logger';
import eventsQueue from './queue';
import utils from './utils'
import { addEvent } from '../backend/api';

const log = logger.getLogger('handler');
const Raven = logger.Raven;

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
  /*'ProposalAccepted',
  'ProposalExpired',
  'IneligibleCreator',
  'IneligibleEditor',
  'ClosedForVote',
  'ClosedForEdit',
  'IneligibleVoter',
  'IneligibleEditor',
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
  'TagAssociated',
  'TagDisassociated',
  'TagProposed',
  'TagActivated',*/
];

/**
 * @dev eventRouter is provided with a job from the Bull queue and tries to send
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
      const evData = utils.getEventData(job.data.event);

      // Add event to the DB
      try {
        await addEvent({
          contract_address: job.data.address,
          transaction_hash: job.data.txHash,
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

      // Send it to the handler
      let handler = loadHandler(eventName);

      if (!handler) {
        throw new Error(`Unable to load handler for ${eventName}`);
      }

      const handlerResult = await handler(job);
      return handlerResult;

    } else {
      log.warn("Event without handler!");
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
