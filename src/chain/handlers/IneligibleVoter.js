/**
 * This is the event handler for PeerReview.IneligibleVoter
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const EVENT_NAME = 'IneligibleVoter';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return await handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    await addNotification(evData.voter, EVENT_NAME, {
      proposalId: evData.proposalId,
      event: EVENT_NAME,
      message: "Permission denied to vote on this proposal.",
    });
  });
};