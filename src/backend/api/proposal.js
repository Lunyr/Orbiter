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
