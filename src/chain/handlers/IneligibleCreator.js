/**
 * This is the event handler for PeerReview.IneligibleCreator
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const log = logger.getLogger('IneligibleCreator');

export default async (job) => {
  log.debug("IneligibleCreator handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'IneligibleCreator')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  await addNotification(evData.creator, 'IneligibleCreator', {
    proposalId: null,
    event: 'IneligibleCreator',
    message: "Permission denied to create a proposal.",
  });

  job.progress(50);

  await utils.completeTransaction(txHash, TxType.PUBLISH);

  job.progress(100);

};