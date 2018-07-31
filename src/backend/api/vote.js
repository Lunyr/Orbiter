import { db } from '../db';
import { ProposalState, TransactionState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';

const log = getLogger('api-vote');

export const getVote = async (voteId) => {
  try {
    const data = await db('vote').where({
      vote_id: voteId
    }).select();
    log.debug({ data }, "getVote result");
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

export const getDirtyVotes = async () => {
  try {
    const data = await db('vote').where({
      dirty: true
    }).select();
    log.debug({ data }, "getDirtyVotes result");
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

export const addVote = async (voteObj) => {
  try {
    const data = await db('vote').insert(voteObj);
    log.debug({ data }, "addVote result");
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

export const updateVote = async (voteId, voteObj) => {
  try {
    const data = await db('vote').where({
      vote_id: voteId
    }).update(voteObj);
    log.debug({ data }, "updateVote result");
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

export const getProposalVoteStats = async (proposalId, fromAddress) => {
  try {
    const results = await db.raw(
      `SELECT 
        (SELECT COUNT(hash) 
          FROM watch
          WHERE transaction_state_id = ?
          AND proposal_id = ?) AS pending,
        (SELECT COUNT(vote_id) 
          FROM vote
          WHERE proposal_id = ?) AS complete,
        (SELECT COUNT(vote_id)
          FROM vote v
          WHERE v.from_address = ?
          AND v.proposal_id = ?) AS user;`,
      [
        TransactionState.PENDING,
        proposalId,
        proposalId,
        fromAddress,
        proposalId,
      ]
    );
    const data = {
      pending: parseInt(results[0].pending),
      complete: parseInt(results[0].complete),
      user: parseInt(results[0].user),
      total: parseInt(results[0].complete) + parseInt(results[0].pending),
    };
    log.debug({ data }, "getProposalVoteStats result");
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

export const getProposalVotes = async (proposalId) => {
  try {
    const data = await db('vote').where({
      proposal_id: proposalId
    }).select();
    log.debug({ data }, "getProposalVotes result");
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

export const userVotedOnProposal = async (proposalId, fromAddress) => {
  try {
    const data = await db('vote').where({
      proposal_id: proposalId,
      from_address: fromAddress,
    }).select();
    log.debug({ data }, "userVotedOnProposal result");
    return {
      success: true,
      data: (typeof data.length !== 'undefined' && data.length > 0),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getUsersRecentVotes = async (fromAddress, limit) => {
  try {
    limit = limit ? limit : 3;
    const data = await db('vote').where({
      from_address: fromAddress,
    }).orderBy('created', 'DESC').limit(limit).select();
    log.debug({ data }, "getUsersRecentVotes result");
    return {
      success: true,
      data: (typeof data.length !== 'undefined' && data.length > 0),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
