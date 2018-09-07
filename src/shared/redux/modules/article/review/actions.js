import {
  getCurrentArticleByTitle,
  getProposal,
  userVotedOnProposal,
} from '../../../../../backend/api';
import createTriggerAlias from '../../../helpers/createTriggerAlias';
import { includeContributors } from '../common';

const actions = {
  FETCH: 'review/FETCH_REVIEW',
  CHECK_VOTING_ELIGIBILITY: 'review/CHECK_VOTING_ELIGIBILITY',
};

const includeOldArticle = async ({ data: article }) => {
  const { data: oldArticle } = await getCurrentArticleByTitle(article.title);
  return {
    data: {
      ...article,
      oldArticle,
    },
  };
};

export const fetchArticleProposal = createTriggerAlias(actions.FETCH, (proposalId) => ({
  type: actions.FETCH,
  payload: getProposal(parseInt(proposalId, 10))
    .then(includeOldArticle)
    .then(includeContributors),
}));

export const fetchVotingEligibility = createTriggerAlias(
  actions.CHECK_VOTING_ELIGIBILITY,
  (userAddress, proposalId) => ({
    type: actions.CHECK_VOTING_ELIGIBILITY,
    payload: userVotedOnProposal(proposalId, userAddress).then(({ data: alreadyVoted }) => {
      return {
        data: {
          canReview: !alreadyVoted,
          reason: alreadyVoted
            ? {
                type: 'already-voted',
              }
            : {},
        },
      };
    }),
  })
);

export default actions;
