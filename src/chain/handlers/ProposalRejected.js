/**
 * This is the event handler for PeerReview.ProposalAccepted
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { 
  addNotification,
  getProposal,
  rejectProposal,
} from '../../backend/api';

const log = logger.getLogger('ProposalRejected');

export default async (job) => {
  console.log("#####################################################################################");
  console.log("#####################################################################################");
  console.log("#####################################################################################");
  log.debug({ job: job }, "ProposalRejected handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'ProposalRejected')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

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
  const notifResult = await addNotification(user.ethereumAddress, 'ProposalRejected', {
      proposalId: evData.proposalId,
      editStreamId: evData.editStreamId,
      title: proposal.title,
  });
  if (notifResult.success === false) {
    log.error({ errorMessage: notifResult.error }, "Error adding notification!");
  }

  job.progress(100);
  return true;

}