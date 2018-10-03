import { getTags } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  FETCH: 'tagging/FETCH',
  SELECT_GROUP: 'tagging/SELECT_GROUP',
};

/**
 * Fetches the tags for the articles in lunyr
 */
export const fetchTags = createTriggerAlias(actions.FETCH, (limit, offset) => ({
  type: actions.FETCH,
  payload: getTags(limit, offset).then(({ data: tags }) => ({
    tags,
  })),
}));

/**
 * Changes the `selected` tag group
 * @param selected
 * @returns {{meta: {scope: string}, type: string, payload: {selected: *}}}
 */
export const selectTagGroup = (selected) => ({
  meta: {
    scope: 'local',
  },
  type: actions.SELECT_GROUP,
  payload: { selected },
});

export default actions;
