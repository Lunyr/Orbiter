/**
 * This is the event handler for PeerReview.CBNBurned
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { 
  addNotification
} from '../../backend/api';

const EVENT_NAME = 'CBNBurned';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    await addNotification(evData.user, EVENT_NAME, {
      user: evData.user,
      cbnBurned: evData.cbnBurned,
    });
  });
};
