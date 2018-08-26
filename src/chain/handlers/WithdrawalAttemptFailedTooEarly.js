/**
 * This is the event handler for PeerReview.WithdrawalAttemptFailedTooEarly
 */
import { handlerWrapper } from '../utils';

const EVENT_NAME = 'WithdrawalAttemptFailedTooEarly';

export default async (job, txHash, evData) => {
  /**
   * This isn't a thing anymore, so it's just a placeholder to keep the jobs 
   * from erroring.
   */
  return handlerWrapper(EVENT_NAME, txHash, job, null, () => {});
};