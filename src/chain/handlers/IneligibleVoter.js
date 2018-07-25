/**
 * This is the event handler for PeerReview.IneligibleVoter
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const log = logger.getLogger('IneligibleVoter');

export default async (job) => {
  log.debug("IneligibleVoter handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'IneligibleVoter')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  await addNotification(evData.voter, 'IneligibleVoter', {
    proposalId: evData.proposalId,
    event: 'IneligibleVoter',
    message: "Permission denied to vote on this proposal.",
  });

  job.progress(50);

  await utils.completeTransaction(txHash, TxType.VOTE);

  job.progress(100);

};