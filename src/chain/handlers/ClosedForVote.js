/**
 * This is the event handler for PeerReview.ClosedForVote
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const log = logger.getLogger('ClosedForVote');

export default async (job) => {
  log.debug("ClosedForVote handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'ClosedForVote')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  await addNotification(evData.voter, 'ClosedForVote', {
    proposalId: evData.proposalId,
    event: 'ClosedForVote',
    message: "This proposal is closed for voting.",
  });

  job.progress(50);

  await utils.completeTransaction(txHash, TxType.VOTE);

  job.progress(100);

};