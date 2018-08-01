import { DraftState } from '../../shared/constants';
import { clearUndefined } from './utils';

/**
 * toDraft takes a draft object and assembles a draft object that can be 
 * displayed to the user.
 * @param {object} - The draft to convert
 * @return {object} - The newly assembled raw draft object
 */
export const toDraft = (draft) => {
  return {
    id: draft.draft_id,
    proposalId: draft.proposal_id || null,
    createdAt: draft.created,
    updatedAt: draft.updated,
    uuid: draft.doc_uuid,
    editStreamId: draft.edit_stream_id,
    heroImageHash: draft.hero_hash || null,
    megadraft: draft.megadraft || null,
    parentId: draft.parent_id || null,
    state: draft.draft_state_id,
    title: draft.title || null,
    referenceMap: draft.reference_map ? JSON.stringify(draft.reference_map) : null,
    additionalContent: draft.additional_content ? JSON.stringify(draft.additional_content) : null,
    imageOffsetRatio: draft.image_offset || null,
    description: draft.description || null,
  };
}

/**
 * fromDraft takes a draft object in the form that the frontend expects and 
 * translates it into the form the DB wants
 * @param {object} - The draft to convert
 * @param {boolean} - Whether or not it's a partial object(usually for updates)
 * @return {object} - The newly assembled DB-compatible draft object
 */
export const fromDraft = (draft, isPartial = false) => {
  let result =  {
    draft_id: draft.id,
    proposal_id: draft.proposalId,
    created: draft.createdAt,
    updated: draft.updatedAt,
    doc_uuid: draft.uuid,
    edit_stream_id: draft.editStreamId,
    hero_hash: draft.heroImageHash,
    megadraft: draft.megadraft,
    parent_id: draft.parentId,
    draft_state_id: draft.state || DraftState.DRAFT,
    title: draft.title,
    reference_map: draft.referenceMap ? JSON.stringify(draft.referenceMap) : undefined,
    additional_content: draft.additionalContent ? JSON.stringify(draft.additionalContent) : undefined,
    image_offset: draft.imageOffsetRatio,
    description: draft.description,
  };
  if (isPartial) result = clearUndefined(result);
  return result;
}
