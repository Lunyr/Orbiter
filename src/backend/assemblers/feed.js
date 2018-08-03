
/**
 * toFeedVote serializes a vote intended for a feed
 * @param {object} - The raw query results with the values we need
 * @return {object} - The newly assembled raw feed vote object
 */
export const toFeedVote = (vote) => {
  if (typeof vote.serialize !== 'undefined') vote = vote.serialize();
  return {
    acceptance: vote.acceptance,
    updatedAt: vote.updated,
    createdAt: vote.created,
    dirty: vote.dirty,
    proposal: {
      id: vote.proposal_id,
      proposalId: vote.proposal_id,
      title: vote.title,
      heroImageHash: vote.hero_hash,
      description: vote.description,
    },
    fromAddress: vote.from_address,
    type: "vote"
  };
};

/**
 * toFeedVote serializes a proposal intended for a feed
 * @param {object} - The raw query results with the values we need
 * @return {object} - The newly assembled raw feed proposal object
 */
export const toFeedProposal = (proposal) => {
  if (typeof proposal.serialize !== 'undefined') proposal = proposal.serialize();
  return {
    id: proposal.proposal_id,
    proposalId: proposal.proposal_id,
    createdAt: proposal.created,
    updatedAt: proposal.updated,
    parentId: proposal.parent_id,
    title: proposal.title,
    heroImageHash: proposal.hero_hash,
    description: proposal.description,
    dirty: proposal.dirty,
    fromAddress: proposal.from_address,
    type: proposal.type,
  };
};
