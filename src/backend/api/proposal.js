import { db } from '../db';
import { ProposalState, TxType } from '../../shared/constants';
import { getLogger } from '../../lib/logger';
import { toArticle, fromArticle } from '../assemblers';

const log = getLogger('api-proposal');

export const getProposal = async (proposalId) => {
  try {
    const result = await db('proposal')
      .where({
        proposal_id: proposalId,
      })
      .select();

    log.debug({ result }, 'getProposal result');

    const data = result.map((p) => toArticle(p));

    return {
      success: true,
      data: data.length > 0 ? data[0] : null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getDirtyProposals = async () => {
  try {
    const result = await db('proposal')
      .where({
        dirty: true,
      })
      .select();

    log.debug({ result }, 'getDirtyProposals result');

    const data = result.map((p) => toArticle(p));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const addProposal = async (propObj) => {
  try {
    propObj = fromArticle(propObj);
    const data = await db('proposal').insert(propObj);
    log.debug({ data }, 'addProposal result');
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateProposal = async (proposalId, propObj) => {
  try {
    propObj = fromArticle(propObj, true);
    const data = await db('proposal')
      .where({
        proposal_id: proposalId,
      })
      .update(propObj);
    log.debug({ data }, 'addNotification result');
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const rejectProposal = async (proposal_id) => {
  try {
    const data = await db('proposal')
      .where({
        proposal_id,
      })
      .update({
        proposal_state_id: ProposalState.REJECTED,
      });
    log.debug({ data }, 'rejectProposal result');
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const acceptProposal = async (proposal_id) => {
  try {
    const data = await db('proposal')
      .where({
        proposal_id,
      })
      .update({
        proposal_state_id: ProposalState.ACCEPTED,
      });
    log.debug({ data }, 'acceptProposal result');
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const expireProposal = async (proposal_id) => {
  try {
    const data = await db('proposal')
      .where({
        proposal_id,
      })
      .update({
        proposal_state_id: ProposalState.EXPIRED,
      });
    log.debug({ data }, 'expireProposal result');
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getProposalsWrittenBy = async (address) => {
  try {
    const result = await db('edit_stream')
      .innerJoin('proposal', 'proposal.edit_stream_id', 'edit_stream.edit_stream_id')
      .where({
        from_address: address,
      })
      .where('proposal_state_id', 'IN', [ProposalState.REJECTED, ProposalState.ACCEPTED])
      .orderBy('created', 'DESC')
      .select();

    log.debug({ result }, 'getArticlesWrittenBy result');

    const data = result.map((p) => toArticle(p));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getProposalsInReviewBy = async (address) => {
  try {
    const result = await db('edit_stream')
      .innerJoin('proposal', 'proposal.edit_stream_id', 'edit_stream.edit_stream_id')
      .where({
        from_address: address,
        proposal_state_id: ProposalState.IN_REVIEW,
      })
      .orderBy('created', 'DESC')
      .select();

    log.debug({ result }, 'getProposalsInReviewBy result');

    const data = result.map((p) => toArticle(p));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getProposalsInReview = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const result = await db('proposal')
      .where({
        proposal_state_id: ProposalState.IN_REVIEW,
      })
      .orderBy('created', 'DESC')
      .offset(offset)
      .limit(limit)
      .select();

    log.debug({ result }, 'getProposalsInReview result');

    const data = result.map((p) => toArticle(p));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getProposalsStats = async (userAddress) => {
  try {
    const result = await db.raw(
      `SELECT
        (SELECT COUNT(proposal_id)
          FROM proposal) AS submitted,
        (SELECT COUNT(proposal_id)
          FROM proposal
          WHERE proposal_state_id = ? OR proposal_state_id = ?) AS reviewed,
        (SELECT COUNT(proposal_id)
          FROM proposal
          WHERE proposal_state_id = ?) AS unreviewed;`,
      [
        ProposalState.ACCEPTED, 
        ProposalState.REJECTED,
        ProposalState.IN_REVIEW,
      ]
    );

    // Now user specific
    let userResult;
    if (userAddress) {
      userResult = await db.raw(
        `SELECT
          (SELECT COUNT(proposal_id)
            FROM proposal
            WHERE proposal_state_id = ?
            AND from_address = ?) AS accepted,
          (SELECT COUNT(proposal_id)
            FROM proposal
            WHERE proposal_state_id = ?
            AND from_address = ?) AS rejected,
          (SELECT COUNT(proposal_id)
            FROM proposal
            WHERE proposal_state_id = ?
            AND from_address = ?) AS review;`,
        [
          ProposalState.ACCEPTED,
          userAddress,
          ProposalState.REJECTED,
          userAddress,
          ProposalState.IN_REVIEW,
          userAddress,
        ]
      );
    }

    log.debug({ result, userResult }, 'getProposalsInReview result');

    if (!result || result.length < 1) {
      log.warn("No results for proposal statistics.  Not synced?");
      return {
        success: false,
        error: "No results",
      };
    }

    const stats = result[0];
    const user_stats = userResult && userResult.length > 0 
      ? userResult[0]
      : null;

    // Build the output object
    const data = {
      reviewed: stats.reviewed,      // # of reviewed proposals ever 
      submitted: stats.submitted,    // # of submitted proposals ever
      unreviewed: stats.unreviewed,  // # of unreviewed proposals ever
      accepted: null,                // # of accepted proposals from a user by address 
      rejected: null,                // # of rejected proposals from a user by address
      inReview: null,                // # of inReview proposals from a user by address
    };

    // Fill in user stats if we have 'em
    if (user_stats) {
      data.accepted = user_stats.accepted;
      data.rejected = user_stats.rejected;
      data.inReview = user_stats.review;
    };

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
