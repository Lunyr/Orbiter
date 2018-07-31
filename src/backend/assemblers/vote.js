
/**
 * toVote serializes a vote
 * @param {object} - The vote to convert
 * @return {object} - The newly assembled raw vote object
 */
export const toVote = (vote) => {
  return {
    id: vote.vote_id,
    acceptance: vote.acceptance,
    proposalId: vote.proposal_id,
    fromAddress: vote.vote_from_address || vote.from_address,
    surveyHash: vote.survey_hash,
    notes: vote.notes,
    overallFeeling: vote.overall,
    standardOfWriting: vote.standard,
    comprehensiveCoverage: vote.comprehensive,
    viewpointsFairness: vote.viewpoints,
    accuracy: vote.accuracy,
    sources: vote.sources,
    thoroughResearch: vote.thorough,
    createdAt: vote.vote_created || vote.created,
    updatedAt: vote.vote_updated || vote.updated,
    checklist: vote.checklist,
    accepted : vote.accepted,
    dirty: vote.dirty,
  };
};
