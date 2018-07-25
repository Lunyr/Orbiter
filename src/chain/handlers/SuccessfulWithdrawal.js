/**
 * This is the event handler for PeerReview.SuccessfulWithdrawal
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { 
  addNotification
} from '../../backend/api';

const log = logger.getLogger('SuccessfulWithdrawal');

module.exports = async (job) => {
  log.debug({ job: job }, "SuccessfulWithdrawal handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'SuccessfulWithdrawal')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);
  
  await addNotification(evData.withdrawer, 'SuccessfulWithdrawal', {
    withdrawer: evData.withdrawer,
    amount: evData.amount,
  });

  job.progress(50);

  await utils.completeTransaction(txHash);

  job.progress(100);

};