/**
 * This is the event handler for PeerReview.HNRBurned
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { 
  addNotification
} from '../../backend/api';

const EVENT_NAME = 'HNRBurned';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    await addNotification(evData.user, EVENT_NAME, {
      user: evData.user,
      hnrBurned: evData.hnrBurned,
    });
  });
};