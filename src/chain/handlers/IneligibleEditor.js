/**
 * This is the event handler for PeerReview.IneligibleEditor
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { 
  addNotification,
} from '../../backend/api';

const log = logger.getLogger('IneligibleEditor');

export default async (job) => {
  log.debug("IneligibleEditor handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'IneligibleEditor')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  await addNotification(evData.editor, 'IneligibleEditor', {
    proposalId: evData.proposalId,
    event: 'IneligibleEditor',
    message: "Permission denied to edit this proposal.",
  });

  job.progress(50);

  await utils.completeTransaction(txHash);

  job.progress(100);

};