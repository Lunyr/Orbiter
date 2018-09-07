import { getCurrentArticleByTitle } from '../../../../../backend/api';
import createTriggerAlias from '../../../helpers/createTriggerAlias';
import { includeContributors } from '../common';

const actions = {
  FETCH: 'reader/FETCH_ARTICLE',
};

export const fetchArticleByTitle = createTriggerAlias(actions.FETCH, (title) => ({
  type: actions.FETCH,
  payload: getCurrentArticleByTitle(title).then(includeContributors),
}));

export default actions;
