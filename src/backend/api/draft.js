import { db } from '../db';
import { DraftState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';

const log = getLogger('api-draft');

export const getDraft = async (uuid) => {
  try {
    const data = await db('draft').where({
      doc_uuid: doc_uuid,
    }).select();
    log.debug({ data }, "getDraft result");
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

export const getDraftByProposalId = async (proposalId, draftStateId) => {
  draftStateId = draftStateId ? draftStateId : DraftState.DRAFT;
  try {
    const data = await db('draft').where({
      proposal_id: proposalId,
      draft_state_id: draftStateId,
    }).select();
    log.debug({ data }, "getDraftByProposalId result");
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
    log.debug({ data }, "setDraftToDraft result");
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

export const addDraft = async (draftObj) => {
  try {
    const data = await db('draft').insert(draftObj);
    log.debug({ data }, "addDraft result");
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

export const editDraft = async (uuid, draftObj) => {
  try {
    const data = await db('draft').where({
      doc_uuid: uuid
    }).update(draftObj);
    log.debug({ data }, "editDraft result");
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
