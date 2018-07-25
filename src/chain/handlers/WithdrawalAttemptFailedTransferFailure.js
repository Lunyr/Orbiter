/**
 * This is the event handler for PeerReview.WithdrawalAttemptFailedTransferFailure
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { 
  addNotification
} from '../../backend/api';

const log = logger.getLogger('WithdrawalAttemptFailedTransferFailure');

export default async (job) => {
  log.debug("WithdrawalAttemptFailedTransferFailure handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'WithdrawalAttemptFailedTransferFailure')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);
  
  await addNotification(evData.withdrawer, 'WithdrawalAttemptFailedTransferFailure', {
    withdrawer: evData.withdrawer,
    amount: evData.amount,
  });

  job.progress(50);

  await utils.completeTransaction(txHash, TxType.BID);

  job.progress(100);

};