/**
 * This is the event handler for PeerReview.ClosedForVote
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const EVENT_NAME = 'ClosedForVote';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return await handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    await addNotification(evData.voter, EVENT_NAME, {
      proposalId: evData.proposalId,
      event: EVENT_NAME,
      message: "This proposal is closed for voting.",
    });
  });
};