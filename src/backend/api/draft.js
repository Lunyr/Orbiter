import { db } from '../db';
import { DraftState } from '../../shared/constants';

export const getDraftByProposalId = async (proposalId, draftStateId) => {
  draftStateId = draftStateId ? draftStateId : DraftState.DRAFT;
  try {
    const data = await db('draft').where({
      proposal_id: proposalId,
      draft_state_id: draftStateId,
    }).select();
    console.log("getDraftByProposalId result", data);
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

export const setDraftToDraft = async (draftId) => {
  try {
    const data = await db('draft').where({
      draft_id: draftId,
    }).update({
        draft_state_id: DraftState.DRAFT
    });
    console.log("setDraftToDraft result", data);
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
