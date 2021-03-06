/**
 * The Janitor handles things that the event handler may miss for whatever 
 * reason.  For instance, the original reason it was created was to deal with 
 * IPFS docs that could not be fetched due to a communication error.  Since the
 * original job would try 3 times, then quit, the idea is that the janitor comes
 * by later and cleans things up(if possible).  There will no doubt be things 
 * that can not be cleaned up.  For instance, some early proposals were lost to 
 * the ether on IPFS and are not available.
 *
 * This duplicates some code from the respective event handlers, so beware.
 */
import multihashes from 'multihashes';
import ipfsAPI from 'ipfs-api';
import utils from './utils';
import { getLogger } from '../lib/logger';
import { getDirtyVotes, updateVote, getDirtyProposals, updateProposal } from '../backend/api';

const log = getLogger('janitor');

// Delay of the overall process
const DELAY = 300000;
// To track check times
const DIRTY_RECORDS = {
  proposals: {},
  votes: {},
};

/**
 * cleanupVotes is the process to deal with "dirty" votes and at attempt
 * to retrieve the IPFS content after the fact.  If something happens during the
 * original 3 tries of the handler and IPFS content can not be pulled, it will 
 * add it anyway and mark it dirty. It runs continuously.
 * @return {Promise} - a promise that should never resolve
 */
const cleanupVotes = () => {
  return new Promise((resolve,reject) => {
    let inProgress = false;
    setInterval(async () => {
      if (inProgress) return;
      inProgress = true;

      // Pull from DB
      const result = await getDirtyVotes();

      const dirtyVotes = result.data;

      log.debug(`Janitor found ${dirtyVotes.length} dirty votes to check`);

      // check ipfs for each vote
      for (let i=0; i<dirtyVotes.length; i++) {
        const vote = dirtyVotes[i];

        // Check each one no more than once per hour
        if (
          typeof DIRTY_RECORDS.votes[vote.id] === 'undefined'
          || new Date() - DIRTY_RECORDS.votes[vote.id] > 3600000
        ) {
          // Look for the IPFS data
          const hexHash = vote.surveyHash;
          const qmHash = multihashes.toB58String(multihashes.fromHexString('1220' + hexHash.slice(2)));
          const content = await utils.ipfsFetch(qmHash, 30000).catch(err => {
            // Ignore the timeout error
            if (err.message.indexOf('timed out') === -1) {
              throw err;
            }
          });

          DIRTY_RECORDS.votes[vote.id] = new Date();

          // If we found it, update the vote
          if (content) {
            let updatedContent;
            if (typeof content.acceptance !== 'boolean') {
              updatedContent = {
                notes: content.notes,
                overallFeeling: content.overallFeeling,
                standardOfWriting: content.standardOfWriting,
                comprehensiveCoverage: content.comprehensiveCoverage,
                viewpointsFairness: content.viewpointsFairness,
                accuracy: content.accuracy,
                sources: content.sources,
                thoroughResearch: content.thoroughResearch,
              };
            }
            // New format since 2/2018
            else {
              updatedContent = {
                checklist: JSON.stringify(content.checklist),
                notes: content.notes,
              }
            }

            // Set not dirty now
            updatedContent.dirty = false;

            try {
              log.info({ vote_id: vote.id }, "Updating vote");
              const updateResult = await updateVote(vote.id, updatedContent);
              if (!updateResult.success) {
                throw new Error(updateResult.error);
              }
            } catch (err) {
              log.error({ 
                vote_id: vote.id, 
                error: err.message
              }, "Could not update vote!")
            }
          }
        } else {
          log.debug({ vote_id: vote.id }, "Content still missing in IPFS.")
        }
      }

      inProgress = false;
    }, DELAY);
  });
};

/**
 * cleanupProposals is the process to deal with "dirty" proposals and at attempt
 * to retrieve the IPFS content after the fact.  If something happens during the
 * original 3 tries of the handler and IPFS content can not be pulled, it will 
 * add it anyway and mark it dirty. It runs continuously.
 * @return {Promise}
 */
const cleanupProposals = () => {
  return new Promise((resolve,reject) => {
    let inProgress = false;
    setInterval(async () => {
      if (inProgress) return;
      inProgress = true;

      // Pull from DB
      const result = await getDirtyProposals();

      const dirtyProposals = result.data;

      log.debug(`Janitor found ${dirtyProposals.length} dirty proposals to check`);

      // check ipfs for each vote
      for (let i=0; i<dirtyProposals.length; i++) {
        const proposal = dirtyProposals[i];

        // Check each one no more than once per hour
        if (
          typeof DIRTY_RECORDS.proposals[proposal.id] === 'undefined'
          || new Date() - DIRTY_RECORDS.proposals[proposal.id] > 3600000
        ) {
          // Look for the IPFS data
          const hexHash = proposal.contentHash;
          const qmHash = multihashes.toB58String(multihashes.fromHexString('1220' + hexHash.slice(2)));
          const content = await utils.ipfsFetch(qmHash, 30000).catch(err => {
            // Ignore the timeout error
            if (err.message.indexOf('timed out') === -1) {
              throw err;
            }
          });

          DIRTY_RECORDS.proposals[proposal.id] = new Date();

          if (content) {
            let updatedContent = {};
            /**
             * all JSON must be a string for SQLite
             */
            let refMap = JSON.stringify(content.referenceMap);
            let additional = JSON.stringify(content.additionalContent);

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
            updatedContent.uuid = doc_uuid || null;
            updatedContent.imageOffsetRatio = content.imageOffsetRatio || null;
            updatedContent.heroImageHash = content.heroImageHash || null;
            updatedContent.title = content.title.replace(new RegExp('_', 'g'), ' ');
            updatedContent.referenceMap = refMap || null;
            updatedContent.additionalContent = additional || null;
            updatedContent.description = content.description;
            updatedContent.megadraft = content.megadraft;

            // Not dirty anymore
            updatedContent.dirty = false

            try {
              log.info({ proposal_id: proposal.id }, "Updating proposal");
              const updateResult = await updateProposal(proposal.id, updatedContent);
              if (!updateResult.success) {
                throw new Error(updateResult.error);
              }
            } catch (err) {
              log.error({ 
                proposal_id: proposal.id, 
                error: err.message
              }, "Could not update vote!")
            }
          } else {
            log.debug({ 
              proposal_id: proposal.id
            }, "Content still missing in IPFS.");
          }
        }
      }

      inProgress = false;
    }, DELAY);
  });
}

/**
 * init kicks off the janitor sub-processes
 */
export default () => {
  log.info("Starting Janitor...");
  try {
    return Promise.race([
      cleanupProposals(),
      cleanupVotes(),
    ]);
  } catch(err) {
    log.error({ error: err.message }, "Unhandled error in janitor!");
  }
};
