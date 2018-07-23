/**
 * This is the event handler for PeerReview.ProposalSubmitted
 */
import multihashes from 'multihashes';
import settings from '../../shared/settings';
import logger from '../../lib/logger';
import utils from '../utils';
import { ProposalState, TxType } from '../../shared/constants';
import { 
  addNotification,
  addEditStream,
  getEditStream,
  addProposal,
  getProposal,
} from '../../backend/api';

const log = logger.getLogger('ProposalSubmitted');
const completeTransaction = utils.completeTransaction;

export default async (job) => {
  log.debug("ProposalSubmitted handler reached");

  job.progress(1);
  console.log("job.data", job.data);
  // Sanity check
  if (job.data.event.name !== 'ProposalSubmitted')
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

  // Check and see if the proposal already exists(it shouldn't)
  const proposalCheck = await getProposal(evData.proposalId);
  if (proposalCheck.success === true && proposalCheck.data.length > 0) {
    log.warn({ proposalId: evData.proposalId }, 'Proposal already exists in DB.');

    // Verify that the conflict is valid and not an actual conflict
    // TODO: Check more values, like contentHash
    //const conflictingProp = proposalCheck.attributes;
    if (
      proposalCheck.edit_stream_id == evData.editStreamId
      && proposalCheck.proposal_id == evData.proposalId
    ) {
      return;
    } else {
      throw new Error(`Proposal conflict at ID ${evData.voteId}!`);
    }
  }

  job.progress(33);

  let proposal = {
    proposal_id: evData.proposalId,
    parent_id: evData.parentId == 0 ? null : evData.parentId,
    proposal_state_id: ProposalState.IN_REVIEW,
    edit_stream_id: evData.editStreamId,
    from_address: evData.proposer,
    content_hash: evData.contentHash,
    doc_uuid: null,
    image_offset: null,
    hero_hash: null,
    title: null,
    reference_map: null,
    additional_content: null,
    description: null,
    megadraft: null,
  }
  if (blockStamp) {
    proposal.created = blockStamp;
  }

  let content;

  /**
   * This really shouldn't happen often, but something that needs to be 
   * considered and dealt with in a slightly different way are when empty IPFS
   * hashes are provided to the contract.  Without these, we have nothing to 
   * look up.
   */
  if (evData.contentHash == utils.EMPTY_IPFS_HEX) {
    job.progress(34);

    // Let the user know what happened
    await addNotification(evData.proposer, 'Error', {
        proposalId: evData.proposalId,
        editStreamId: evData.editStreamId,
        title: "",
        message: "Sorry but there was an error with your proposal. Unfortunately you will be unable to resubmit your proposal until the proposal expires or is reviewed. A copy has been saved in your drafts.  We apologize for any inconvenience."
    });

    job.progress(68);
  } else {
    job.progress(35);

    // Fetch data from IPFS
    content = await utils.ipfsFetch(evData.contentHash, 30000).catch(err => {
      // Ignore the timeout error
      if (err.message.indexOf('timed out') === -1) {
        throw err;
      }
    });
    if (!content && job.attempts < settings.eventLogConfig.attempts) {
      throw new Error('Unable to find ipfs file @ ' + evData.contentHash)
    } else if (!content && job.attempts >= settings.eventLogConfig.attempts) {
      job.progress(56);

      /**
       * If we've tried 3 times and still can't get the IPFS data, it must be 
       * lost in the ether.  So, we're going to do our best to cope here
       */
      proposal.doc_uuid = null;
      proposal.image_offset = null;
      proposal.hero_hash = null;
      proposal.title = null;
      proposal.reference_map = null;
      proposal.additional_content = null;
      proposal.description = null;
      proposal.megadraft = null;

      // Make sure it's marked as dirty
      proposal.dirty = true;

      job.progress(70);
    } else {
      job.progress(55);

      /**
       * This is some weird stuff with postgres.  If the JSON is an array, it 
       * must be inserted using a string.  Otherwise, PG tries to convert the 
       * value into a postgres array instead of a JSON array.  This is dumb, I
       * don't know why.
       *
       * Ref: https://github.com/brianc/node-postgres/issues/442
       */
      let refMap = content.referenceMap;
      if (typeof refMap === 'object' && refMap instanceof Array) {
        refMap = JSON.stringify(refMap);
      }

      let additional = content.additionalContent ;
      if (typeof additional === 'object' && additional instanceof Array) {
        additional = JSON.stringify(additional);
      }

      /**
       * Early on, there were a bunch of UUIDs submitted and saved to IPFS with
       * unknown formatting.  We have to ditch these because I sure don't know
       * what to do with them.  They seem to be 64-char hex strings.
       */
      const badUUIDPattern = /[A-Fa-f0-9]{64}/;
      let doc_uuid = content.uuid;
      if (typeof content.uuid === 'string' && content.uuid.match(badUUIDPattern)) {
        doc_uuid = null;
      }

      // Populate proposal with data from IPFS
      proposal.doc_uuid = doc_uuid || null;
      proposal.image_offset = content.imageOffsetRatio || null;
      proposal.hero_hash = content.heroImageHash || null;
      proposal.title = content.title.replace(new RegExp('_', 'g'), ' ');
      proposal.reference_map = refMap || null;
      proposal.additional_content = additional || null;
      proposal.description = content.description;
      proposal.megadraft = content.megadraft;

      // lang was introduced in late April 2018
      proposal.lang = typeof content.lang !== 'undefined' ? content.lang : null;

      job.progress(69);
    }
  }

  // Look for an existing edit stream
  const editStreamCheck = await getEditStream(evData.editStreamId);

  job.progress(75);

  // Create a new edit stream if this one isn't in the DB
  if (editStreamCheck.data.length < 1) {
    // Set language only if we're creating a new stream, otherwise, see ProposalAccepted
    let lang = null;
    if (content) {
      lang = content.lang;
    }
    await addEditStream({
      edit_stream_id: evData.editStreamId,
      title: proposal.title,
      lang,
    });
  }

  job.progress(80);

  // Create the proposal 
  await addProposal(proposal);

  job.progress(90);

  await completeTransaction(txHash, TxType.PUBLISH);

  job.progress(100);
  return true;

}