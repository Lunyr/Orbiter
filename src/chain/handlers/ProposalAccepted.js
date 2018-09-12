/**
 * This is the event handler for PeerReview.ProposalAccepted
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import {
  addNotification,
  getEditStream,
  updateEditStream,
  getProposal,
  acceptProposal,
} from '../../backend/api';

const EVENT_NAME = 'ProposalAccepted';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);

    const proposalCheck = await getProposal(evData.proposalId);

    if (!proposalCheck.success || !proposalCheck.data) {
      throw new Error('Proposal not found!');
    }

    const proposal = proposalCheck.data[0];

    job.progress(30);

    // Update edit stream if necessary
    const editStreamCheck = await getEditStream(evData.editStreamId);

    if (!editStreamCheck.success || !editStreamCheck.data) {
      throw new Error('Unknown edit stream!  Events out of order?');
    }

    job.progress(35);

    // We need to update the title only if it changed and lang only if it was never set
    let editStreamPatch = null;

    // Patch edit stream with proposal lang
    if (proposal && proposal.lang !== null && editStreamCheck.data[0].lang === null) {
      if (!editStreamPatch) editStreamPatch = {};
      editStreamPatch.lang = proposal.lang;
    }

    // update the edit stream title if necessary
    if (proposal && proposal.title !== null && editStreamCheck.data[0].title) {
      if (!editStreamPatch) editStreamPatch = {};
      editStreamPatch.title = proposal.title;
    }

    if (editStreamPatch) {
      const updateEditStreamResult = await updateEditStream(
        editStreamCheck.data[0].editStreamId,
        editStreamPatch
      );
      if (!updateEditStreamResult.success) {
        throw new Error(updateEditStreamResult.error);
      }
    }

    job.progress(40);

    // Update proosal state
    const acceptResult = await acceptProposal(evData.proposalId);

    job.progress(80);

    // Create a notification for the user
    if (proposal) {
      const notifResult = await addNotification(proposal.fromAddress, EVENT_NAME, {
        proposalId: evData.proposalId,
        editStreamId: evData.editStreamId,
        title: proposal.title,
      });
      if (notifResult.success === false) {
        log.error({ errorMessage: notifResult.error }, 'Error adding notification!');
      }
    }

    job.progress(90);
  });
};
