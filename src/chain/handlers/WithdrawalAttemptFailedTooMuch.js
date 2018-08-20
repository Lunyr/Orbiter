/**
 * This is the event handler for PeerReview.WithdrawalAttemptFailedTooMuch
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { 
  addNotification
} from '../../backend/api'

const EVENT_NAME = 'WithdrawalAttemptFailedTooMuch';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);
    
    await addNotification(evData.withdrawer, EVENT_NAME, {
      withdrawer: evData.withdrawer,
      amount: evData.amount,
      maximum: evData.maximum,
    });

    job.progress(50);
  });
};