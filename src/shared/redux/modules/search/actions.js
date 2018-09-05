import { searchArticles } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  QUERY: 'search/QUERY',
};

export const search = createTriggerAlias(actions.QUERY, (query) => ({
  type: actions.QUERY,
  payload: searchArticles(query),
}));

export default actions;
