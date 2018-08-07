/**
 * This is the event handler for PeerReview.ProposalAccepted
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { 
  addNotification,
  getEditStream,
  updateEditStream,
  getProposal,
  acceptProposal,
} from '../../backend/api';

const log = logger.getLogger('ProposalAccepted');

export default async (job) => {
  log.debug("ProposalAccepted handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'ProposalAccepted')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  const proposalCheck = await getProposal(evData.proposalId);

  if (!proposalCheck.success || proposalCheck.data.length < 1) {
    throw new Error("Proposal not found!");
  }

  const proposal = proposalCheck.data[0];

  job.progress(30);

  // Update edit stream if necessary
  const editStreamCheck = await getEditStream(evData.editStreamId);

  if (!editStreamCheck.success || editStreamCheck.data.length < 1) {
    throw new Error("Unknown edit stream!  Events out of order?");
  }

  job.progress(35);

  // We need to update the title only if it changed and lang only if it was never set
  let editStreamPatch = null;

  if (editStreamCheck.data[0].lang === null && proposal.lang !== null) {
    if (!editStreamPatch) editStreamPatch = {};
    editStreamPatch.lang = proposal.lang;
  }

  // update the edit stream title if necessary
  if (editStreamCheck.data[0].title != proposal.title) {
    if (!editStreamPatch) editStreamPatch = {};
    editStreamPatch.title = proposal.title;
  }

  if (editStreamPatch) {
    const updateEditStreamResult = await updateEditStream(editStreamCheck.data[0].editStreamId, editStreamPatch);
    if (!updateEditStreamResult.success) {
      throw new Error(updateEditStreamResult.error);
    }
  }

  job.progress(40);

  // Update proosal state
  const acceptResult = await acceptProposal(evData.proposalId);

  job.progress(80);

  // Create a notification for the user
  const notifResult = await addNotification(proposal.fromAddress, 'ProposalAccepted', {
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
