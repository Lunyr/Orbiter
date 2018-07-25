/**
 * This is the event handler for PeerReview.WithdrawalAttemptFailedTooMuch
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { 
  addNotification
} from '../../backend/api'

const log = logger.getLogger('WithdrawalAttemptFailedTooMuch');

export default async (job) => {
  log.debug("WithdrawalAttemptFailedTooMuch handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'WithdrawalAttemptFailedTooMuch')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);
  
  await addNotification(evData.withdrawer, 'WithdrawalAttemptFailedTooMuch', {
    withdrawer: evData.withdrawer,
    amount: evData.amount,
    maximum: evData.maximum,
  });

  job.progress(50);

  await utils.completeTransaction(txHash, TxType.BID);

  job.progress(100);

};