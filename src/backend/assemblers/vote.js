import { clearUndefined } from './utils';

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

/**
 * fromVote serializes a vote for the DB
 * @param {object} - The vote to convert
 * @return {object} - The newly assembled raw vote object
 */
export const fromVote = (vote, isPartial = false) => {
  let result = {
    vote_id: vote.id,
    acceptance: vote.acceptance,
    proposal_id: vote.proposalId,
    from_address: vote.fromAddress,
    survey_hash: vote.surveyHash,
    notes: vote.notes,
    overall: vote.overallFeeling,
    standard: vote.standardOfWriting,
    comprehensive: vote.comprehensiveCoverage,
    viewpoints: vote.viewpointsFairness,
    accuracy: vote.accuracy,
    sources: vote.sources,
    thorough: vote.thoroughResearch,
    created: vote.createdAt,
    updated: vote.updatedAt,
    checklist: vote.checklist,
    accepted : vote.accepted,
    dirty: vote.dirty,
  };
  if (isPartial) result = clearUndefined(result);
  return result;
};
