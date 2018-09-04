import createTriggerAlias from '../../helpers/createTriggerAlias';
import { getArticles } from '../../../../backend/api';

const actions = {
  FETCH_ARTICLES: 'explorer/FETCH_ARTICLES',
};

export const fetchArticles = createTriggerAlias(actions.FETCH_ARTICLES, ({ limit, page }) => ({
  type: actions.FETCH_ARTICLES,
  payload: getArticles(limit, page),
}));

export default actions;
