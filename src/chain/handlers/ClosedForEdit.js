/**
 * This is the event handler for PeerReview.ClosedForEdit
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const log = logger.getLogger('ClosedForEdit');

export default async (job) => {
  log.debug("ClosedForEdit handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'ClosedForEdit')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  await addNotification(evData.editor, 'ClosedForEdit', {
    proposalId: evData.proposalId,
    event: 'ClosedForEdit',
    message: "This proposal is closed for editing.",
  });

  job.progress(50);

  await utils.completeTransaction(txHash);

  job.progress(100);

};