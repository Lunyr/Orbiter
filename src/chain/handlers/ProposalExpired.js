/**
 * This is the event handler for PeerReview.ProposalExpired
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { 
  addNotification,
  getProposal,
  expireProposal,
} from '../../backend/api';

const EVENT_NAME = 'ProposalExpired';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return await handlerWrapper(EVENT_NAME, txHash, job, log, async () => {

    /**
     * LISTEN UP, BITCHES!
     * This here is what happens when you make a mistake on an immutable database.
     * There was a bug in the ProposalExpired event.  The bad event was triggered
     * on mainnet thrice, and twice on testnet, so three txs needs to be accounted 
     * for here. ProposalExpired was sending the proposalId of the replacing 
     * proposal, not the expired proposal.  So here, we're forcibly setting the 
     * right ID because we know the exact offenders.
     *
     * At least the fix is simple, this time.  But let this be a cautionary tale.
     */
    if (txHash === '0x138ba9a8475a081619465b451326752ecac80bcf476b71d652acec70ea7b707f') {
      evData.proposalId = 27;
    }
    if (txHash === '0x952999aab6236027a0375410a88c7ea32ec91dbdef10991b421f2ee681c9bbc0') {
      evData.proposalId = 6;
    }
    if (txHash === '0x937d7c80af3a2662793a6e33ac727c103905bec004dc530ad0c9c9eb76564b37') {
      evData.proposalId = 301;
    }

    job.progress(10);

    const proposalCheck = await getProposal(evData.proposalId);

    if (!proposalCheck.success || proposalCheck.data.length < 1) {
      throw new Error("Proposal not found!");
    }

    const proposal = proposalCheck.data[0];

    job.progress(35);

    // Update proosal state
    const expireResult = await expireProposal(evData.proposalId);
    if (expireResult.success === false) {
      log.error({ errorMessage: expireResult.error }, "Error expiring proposal!");
      throw new Error(expireResult.error);
    }

    job.progress(80);

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
