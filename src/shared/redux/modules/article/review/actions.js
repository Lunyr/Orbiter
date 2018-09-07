import { getCurrentArticleByTitle, getProposal } from '../../../../../backend/api';
import createTriggerAlias from '../../../helpers/createTriggerAlias';
import { includeContributors } from '../common';

const actions = {
  FETCH: 'review/FETCH_REVIEW',
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

export default actions;
