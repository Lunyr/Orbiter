import { db } from '../db';
import { DraftState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';
import { toDraft, fromDraft } from '../assemblers';

const log = getLogger('api-draft');

export const getDraft = async (uuid) => {
  try {
    const result = await db('draft')
      .where({
        doc_uuid: uuid,
        draft_state_id: DraftState.DRAFT,
      })
      .select();

    log.debug({ result }, 'getDraft result');

    const data = result.map((a) => toDraft(a));

    return {
      success: true,
      data: data ? data[0] : {},
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getDrafts = async () => {
  try {
    const result = await db('draft')
      .where({
        draft_state_id: DraftState.DRAFT,
      })
      .select();

    log.debug({ result }, 'getDrafts result');

    const data = result.map((a) => toDraft(a));

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

export const getDraftByProposalId = async (proposalId, draftStateId) => {
  draftStateId = draftStateId ? draftStateId : DraftState.DRAFT;
  try {
    const result = await db('draft')
      .where({
        proposal_id: proposalId,
        draft_state_id: draftStateId,
      })
      .select();

    log.debug({ result }, 'getDraftByProposalId result');

    const data = result.map((a) => toDraft(a));

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
    const data = await db('draft')
      .where({
        draft_id: draftId,
      })
      .update({
        draft_state_id: DraftState.DRAFT,
      });

    log.debug({ data }, 'setDraftToDraft result');

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

export const createDraft = async (draftObj) => {
  try {
    draftObj = fromDraft(draftObj);
    const data = await db('draft').insert(draftObj);
    log.debug({ data }, 'createDraft result');
    return {
      success: true,
      data: data
        ? toDraft({
            ...draftObj,
            id: data[0],
          })
        : null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const saveDraft = async (uuid, draftObj) => {
  try {
    draftObj = fromDraft(draftObj, true);
    const data = await db('draft')
      .where({
        doc_uuid: uuid,
      })
      .update(draftObj);
    log.info({ data }, 'saveDraft result');
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
