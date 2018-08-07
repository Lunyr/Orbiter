import { clearUndefined } from './utils';

/**
 * toArticle takes a proposal object(or returned bookshelf Collection) and 
 * assembles an article object that can be displayed to the user.
 * @param {object} - The proposal to convert
 * @return {object} - The newly assembled raw article object
 */
export const toArticle = (proposal) => {
  // TODO
  const votes = [];
  return {
    id: proposal.proposal_id,
    createdAt: proposal.created,
    updatedAt: proposal.updated,
    proposalId: proposal.proposal_id,
    uuid: proposal.doc_uuid || null,
    fromAddress: proposal.from_address,
    editStreamId: proposal.edit_stream_id,
    contentHash: proposal.content_hash || null,
    heroImageHash: proposal.hero_hash || null,
    megadraft: proposal.megadraft || null,
    parentId: proposal.parent_id || null,
    state: proposal.proposal_state_id,
    title: proposal.title || null,
    referenceMap: proposal.reference_map ? JSON.stringify(proposal.reference_map) : null,
    additionalContent: proposal.additional_content ? JSON.stringify(proposal.additional_content) : null,
    imageOffsetRatio: proposal.image_offset || null,
    description: proposal.description || null,
    dirty: proposal.dirty,
    votes: votes,
    lang: proposal.lang || null
  };
};

/**
 * fromArticle takes a article object from the frontend and assembles an propsal
 * object that can be inserted into the DB.
 * @param {object} - The article to convert
 * @return {object} - The newly assembled raw proposal object
 */
export const fromArticle = (proposal, isPartial = false) => {
  // TODO
  let result = {
    proposal_id: proposal.id,
    created: proposal.createdAt,
    updated: proposal.updatedAt,
    doc_uuid: proposal.uuid || null,
    from_address: proposal.fromAddress,
    edit_stream_id: proposal.editStreamId,
    content_hash: proposal.contentHash || null,
    hero_hash: proposal.heroImageHash || null,
    megadraft: proposal.megadraft || null,
    parent_id: proposal.parentId || null,
    proposal_state_id: proposal.state,
    title: proposal.title || null,
    reference_map: proposal.referenceMap ? JSON.stringify(proposal.referenceMap) : null,
    additional_content: proposal.additionalContent ? JSON.stringify(proposal.additionalContent) : null,
    image_offset: proposal.imageOffsetRatio || null,
    description: proposal.description || null,
    dirty: proposal.dirty,
    lang: proposal.lang || null
  };
  if (isPartial) result = clearUndefined(result);
  return result;
};
