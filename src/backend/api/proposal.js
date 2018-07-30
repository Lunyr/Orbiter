import { db } from '../db';
import { ProposalState, TxType } from '../../shared/constants';

export const getProposal = async (proposalId) => {
  try {
    const data = await db('proposal').where({
      proposal_id: proposalId
    }).select();
    console.log("getProposal result", data);
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

export const getDirtyProposals = async () => {
  try {
    const data = await db('proposal').where({
      dirty: true
    }).select();
    console.log("getDirtyProposals result", data);
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
    const data = await db('proposal').insert(propObj);
    console.log("addProposal insert result", data);
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
    const data = await db('proposal').where({
      proposal_id: proposalId
    }).update(propObj);
    console.log("updateProposal insert result", data);
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
    const data = await db('proposal').where({
      proposal_id
    }).update({
      proposal_state_id: ProposalState.REJECTED
    });
    console.log("Proposal reject result", data);
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
    const data = await db('proposal').where({
      proposal_id
    }).update({
      proposal_state_id: ProposalState.ACCEPTED
    });
    console.log("Proposal accept result", data);
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
    const data = await db('proposal').where({
      proposal_id
    }).update({
      proposal_state_id: ProposalState.EXPIRED
    });
    console.log("expireProposal result", data);
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
    const data = await db('edit_stream').innerJoin(
      'proposal',
      'edit_stream_id',
      'edit_stream_id'
    ).where({
      from_address: address,
    }).where(
      'proposal_state_id', 'IN', [ProposalState.REJECTED, ProposalState.ACCEPTED]
    ).orderBy('created', 'DESC').select();
    log.debug({ data }, "getArticlesWrittenBy result");
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
    const data = await db('edit_stream').innerJoin(
      'proposal',
      'edit_stream_id',
      'edit_stream_id'
    ).where({
      from_address: address,
      proposal_state_id: ProposalState.IN_REVIEW
    }).orderBy('created', 'DESC').select();
    log.debug({ data }, "getProposalsInReviewBy result");
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
    const data = await db('proposal').where({
      proposal_state_id: ProposalState.IN_REVIEW
    }).orderBy('created', 'DESC').select();
    log.debug({ data }, "getProposalsInReviewBy result");
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
