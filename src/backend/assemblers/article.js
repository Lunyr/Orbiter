import { clearUndefined } from './utils';

/**
 * toArticle takes a proposal object(or returned bookshelf Collection) and
 * assembles an article object that can be displayed to the user.
 * @param {object} - The proposal to convert
 * @return {object} - The newly assembled raw article object
 */
export const toArticle = (proposal) => {
  const votes = [];
  let additional = null;
  let reference = null;
  if (proposal.additional_content) {
    if (typeof proposal.additional_content === 'string') {
      additional = JSON.parse(proposal.additional_content);
    } else {
      additional = proposal.additional_content;
    }
  }
  if (proposal.reference_map) {
    if (typeof proposal.reference_map === 'string') {
      reference = JSON.parse(proposal.reference_map);
    } else {
      reference = proposal.reference_map;
    }
  }
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
    referenceMap: reference,
    additionalContent: additional,
    imageOffsetRatio: proposal.image_offset || null,
    description: proposal.description || null,
    dirty: proposal.dirty,
    votes: votes,
    lang: proposal.lang || null,
  };
};

/**
 * fromArticle takes a article object from the frontend and assembles an propsal
 * object that can be inserted into the DB.
 * @param {object} - The article to convert
 * @return {object} - The newly assembled raw proposal object
 */
export const fromArticle = (proposal, isPartial = false) => {
  let additional = null;
  let reference = null;
  if (proposal.additionalContent) {
    if (typeof proposal.additionalContent === 'object') {
      additional = JSON.stringify(proposal.additionalContent);
    } else {
      additional = proposal.additionalContent;
    }
  }
  if (proposal.referenceMap) {
    if (typeof proposal.referenceMap === 'object') {
      reference = JSON.stringify(proposal.referenceMap);
    } else {
      reference = proposal.referenceMap;
    }
  }
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
    reference_map: reference,
    additional_content: additional,
    image_offset: proposal.imageOffsetRatio || null,
    description: proposal.description || null,
    dirty: proposal.dirty,
    lang: proposal.lang || null,
  };
  if (isPartial) result = clearUndefined(result);
  return result;
};
