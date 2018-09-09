import { db } from '../db';
import { ProposalState, TxState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';
import { toVote, fromVote } from '../assemblers';
import { parseIntWithRadix } from '../../shared/utils';

const log = getLogger('api-vote');

export const getVote = async (voteId) => {
  try {
    const result = await db('vote')
      .where({
        vote_id: voteId,
      })
      .select();

    log.debug({ result }, 'getVote result');

    const data = result.map((v) => toVote(v));

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

export const getDirtyVotes = async () => {
  try {
    const result = await db('vote')
      .where({
        dirty: true,
      })
      .select();

    log.debug({ result }, 'getDirtyVotes result');

    const data = result.map((v) => toVote(v));

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
    voteObj = fromVote(voteObj);
    const data = await db('vote').insert(voteObj);
    log.debug({ data }, 'addVote result');
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
    voteObj = fromVote(voteObj);
    const data = await db('vote')
      .where({
        vote_id: voteId,
      })
      .update(voteObj);
    log.debug({ data }, 'updateVote result');
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
      [TxState.PENDING, proposalId, proposalId, fromAddress, proposalId]
    );
    const data = {
      pending: parseInt(results[0].pending),
      complete: parseInt(results[0].complete),
      user: parseInt(results[0].user),
      total: parseInt(results[0].complete) + parseInt(results[0].pending),
    };
    log.debug({ data }, 'getProposalVoteStats result');
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
    const result = await db('vote')
      .where({
        proposal_id: proposalId,
      })
      .select();

    log.debug({ result }, 'getProposalVotes result');

    const data = result.map((v) => toVote(v));

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
    const data = await db('vote')
      .where({
        proposal_id: proposalId,
        from_address: fromAddress,
      })
      .select();
    log.debug({ data }, 'userVotedOnProposal result');
    return {
      success: true,
      data: typeof data.length !== 'undefined' && data.length > 0,
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
    const data = await db('vote')
      .where({
        from_address: fromAddress,
      })
      .orderBy('created', 'DESC')
      .limit(limit)
      .select();
    log.debug({ data }, 'getUsersRecentVotes result');
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

const reasonForIneligibleVote = async (proposalId, fromAddress) => {
  const { contributors, environment } = global.contracts;
  const userHNR = await contributors.getHNR(fromAddress).then(parseIntWithRadix);
  const hnrVoteThreshold = await environment.getValue('hnrVoteThreshold').then(parseIntWithRadix);
  const userCBN = await contributors.getCBN(fromAddress).then(parseIntWithRadix);
  const cbnVoteThreshold = await environment.getValue('cbnVoteThreshold').then(parseIntWithRadix);
  const isBlackListed = await environment.getBlacklist(fromAddress);
  if (userHNR < hnrVoteThreshold || userCBN < cbnVoteThreshold) {
    return {
      type: 'low-rewards',
      context: {
        hnr: {
          user: userHNR,
          minimum: hnrVoteThreshold,
        },
        cbn: {
          user: userCBN,
          minimum: cbnVoteThreshold,
        },
      },
    };
  } else if (isBlackListed) {
    return {
      type: 'blacklist',
    };
  }
  return {
    type: 'already-voted',
  };
};

export const userEligibleToVote = async (proposalId, fromAddress) => {
  try {
    const { data: alreadyVoted } = await userVotedOnProposal(proposalId, fromAddress);

    if (alreadyVoted) {
      return {
        isEligibleToVote: false,
        reason: {
          type: 'already-voted',
        },
      };
    }

    const isEligibleToVote = await global.contracts.peerReview.methods
      .isEligibleToVote(proposalId, fromAddress)
      .call();

    if (!isEligibleToVote) {
      const reason = await reasonForIneligibleVote(proposalId, fromAddress);
      return {
        success: true,
        data: {
          isEligibleToVote,
          reason,
        },
      };
    }
    return {
      success: true,
      data: {
        isEligibleToVote,
        reason: null,
      },
    };
  } catch (err) {
    console.log(err);
    log.error(
      { err: err.message, proposalId, fromAddress },
      'Error while checking if user is eligible to vote on proposal'
    );
    return {
      success: false,
      error: err.message,
    };
  }
};
