import { db } from '../db';

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
