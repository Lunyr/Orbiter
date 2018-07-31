/**
 * This is the event handler for PeerReview.HNRBurned
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { 
  addNotification
} from '../../backend/api';

const log = logger.getLogger('HNRBurned');

export default async (job) => {
  log.debug("HNRBurned handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'HNRBurned')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);
  
  await addNotification(evData.user, 'HNRBurned', {
    user: evData.user,
    hnrBurned: evData.hnrBurned,
  });

  job.progress(50);

  await utils.completeTransaction(txHash);

  job.progress(100);

};