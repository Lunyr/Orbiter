/**
 * This is the event handler for PeerReview.VoteOccurred
 */
import multihashes from 'multihashes';
import settings from '../../shared/settings';
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getProposal,
  getVote,
  addVote,
} from '../../backend/api';

const log = logger.getLogger('VoteOccurred');

export default async (job) => {
  log.debug({ job: job }, "VoteOccurred handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'VoteOccurred')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;
  const tx = await utils.getTransaction(txHash);
  let blockStamp;
  if (!tx) {
    throw new Error("Transaction not found!  Nodes out of sync?");
  } else if (typeof tx.blockNumber !== 'undefined' && tx.blockNumber) {
    const block = await utils.getBlockByNumber(tx.blockNumber);
    if (block) {
      blockStamp = new Date(parseInt(block.timestamp) * 1000);
    }
  }

  job.progress(10);

  const proposalCheck = await getProposal(evData.proposalId);

  if (!proposalCheck.success || proposalCheck.data.length < 1) {
    throw new Error("Proposal for vote not found")
  }

  const proposal = proposalCheck.data[0];

  job.progress(15);

  // No duplicates
  const voteCheck = await getVote(evData.voteId);
  if (voteCheck.data.length > 0) {
    log.warn({ voteId: evData.voteId, proposalId: evData.proposalId }, 'Vote already exists in DB.');

    // Verify that the conflict is valid and not an actual conflict
    // TODO: Check more values, like contentHash
    const conflictingVote = voteCheck.data[0];
    if (
      conflictingVote.vote_id == evData.voteId
      && conflictingVote.proposal_id == evData.proposalId
    ) {
      return;
    } else {
      throw new Error(`Vote conflict at ID ${evData.voteId}!`);
    }
  }

  job.progress(20);

  // Add notification
  await addNotification(proposal.from_address, 'VoteOccurred', {
      voter: evData.voter,
      proposalId: evData.proposalId,
      title: proposal.title,
  });

  // Populate what we can from the blockchain
  let vote = {
    vote_id: evData.voteId,
    proposal_id: evData.proposalId,
    from_address: evData.voter,
    acceptance: typeof evData.acceptance !== 'boolean' ? evData.acceptance : null,
    survey_hash: evData.surveyHash,
    accepted: typeof evData.acceptance === 'boolean' ? evData.acceptance : null,
    overall: 0,
    standard: 0,
    comprehensive: 0,
    viewpoints: 0,
    accuracy: 0,
    sources: 0,
    thorough: 0,
    checklist: null,
    notes: "",
  }

  // Use blockchain timestamp if we have it
  if (blockStamp)
    vote.created = blockStamp;

  job.progress(45);

  if (evData.surveyHash == utils.EMPTY_IPFS_HEX) {
    log.warn({ voteId: evData.voteId }, 'Received empty ipfs hash for vote');
  } else {
    const ipfsHash = multihashes.toB58String(multihashes.fromHexString('1220' + evData.surveyHash.slice(2)))
    let timedoutFetch = false;
    const content = await utils.ipfsFetch(ipfsHash).catch(err => {
      // Ignore the timeout error
      if (err.message.indexOf('timed out') === -1) {
        throw err;
      }
    });

    if (!content) {
      /**
       * If we've tried 3 times and still can't get the IPFS data, it must be 
       * lost to the ether.  So, we're going to do our best to cope here
       */
      if (job.opts.attempts < settings.eventLogConfig.attempts) {
        throw new Error('Unable to find ipfs file @ ' + evData.contentHash)
      } else if (job.opts.attempts >= settings.eventLogConfig.attempts) {
        vote.dirty = true;
      }
    } else {
      // Original format survey
      if (typeof content.acceptance !== 'boolean') {
        Object.assign(vote, {
          notes: content.notes,
          overall: content.overallFeeling,
          standard: content.standardOfWriting,
          comprehensive: content.comprehensiveCoverage,
          viewpoints: content.viewpointsFairness,
          accuracy: content.accuracy,
          sources: content.sources,
          thorough: content.thoroughResearch,
        });
      }
      // New format since 2/2018
      else {
        vote.checklist = JSON.stringify(content.checklist);
        vote.notes = content.notes;
      }
    }
  }

  job.progress(75);

  log.debug({ vote }, "Adding vote");

  await addVote(vote);

  job.progress(90);

  await utils.completeTransaction(txHash, TxType.VOTE);

  job.progress(100);
  return true;

};