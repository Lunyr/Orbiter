/**
 * This is the event handler for PeerReview.ProposalAccepted
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { 
  addNotification,
  getProposal,
  rejectProposal,
} from '../../backend/api';

const EVENT_NAME = 'ProposalRejected';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return await handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);

    const proposalCheck = await getProposal(evData.proposalId);

    if (!proposalCheck.success || proposalCheck.data.length < 1) {
      throw new Error("Proposal not found!");
    }

    const proposal = proposalCheck.data[0];

    job.progress(40);

    // Update proosal state
    const rejectResult = await rejectProposal(evData.proposalId);
    if (rejectResult.success === false) {
      throw new Error(rejectResult.error);
    }

    job.progress(90);

    // Create a notification for the user
    const notifResult = await addNotification(proposal.fromAddress, EVENT_NAME, {
        proposalId: evData.proposalId,
        editStreamId: evData.editStreamId,
        title: proposal.title,
    });
    if (notifResult.success === false) {
      log.error({ errorMessage: notifResult.error }, "Error adding notification!");
    }
    job.progress(90);
  });
}