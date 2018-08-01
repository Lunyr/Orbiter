import { db } from '../db';
import { DraftState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';
import { toDraft, fromDraft } from '../assemblers';

const log = getLogger('api-draft');

export const getDraft = async (uuid) => {
  try {
    const result = await db('draft').where({
      doc_uuid: uuid,
    }).select();

    log.debug({ result }, "getDraft result");

    const data = result.map(a => toDraft(a));

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
    const result = await db('draft').where({
      proposal_id: proposalId,
      draft_state_id: draftStateId,
    }).select();

    log.debug({ result }, "getDraftByProposalId result");

    const data = result.map(a => toDraft(a));

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
    draftObj = fromDraft(draftObj);
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
    draftObj = fromDraft(draftObj, true);
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
