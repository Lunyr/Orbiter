import { getFeed } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  FETCH: 'feed/FETCH',
  FETCH_MORE: 'feed/FETCH_MORE',
  SET_FILTER: 'feed/SET_FILTER',
};

export const fetchFeed = createTriggerAlias(actions.FETCH, ({ limit, page }) => ({
  type: actions.FETCH,
  payload: getFeed(limit, page),
}));

export const fetchMoreFeed = createTriggerAlias(actions.FETCH_MORE, ({ limit, page }) => ({
  type: actions.FETCH_MORE,
  payload: getFeed(limit, page),
}));

export const setFilter = (filter) => ({
  meta: {
    scope: 'local',
  },
  type: actions.SET_FILTER,
  payload: { filter },
});

export default actions;
