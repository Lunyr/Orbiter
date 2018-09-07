import uniq from 'lodash/uniq';
import { getCurrentArticleByTitle, getContributors } from '../../../../../backend/api';
import createTriggerAlias from '../../../helpers/createTriggerAlias';

const actions = {
  FETCH: 'reader/FETCH_ARTICLE',
};

export const fetchArticleByTitle = createTriggerAlias(actions.FETCH, (title) => ({
  type: actions.FETCH,
  payload: getCurrentArticleByTitle(title).then(async ({ data: article }) => {
    const editStreamId = article.editStreamId;
    const normalizedArticle = {
      ...article,
      editorState: JSON.parse(article.megadraft),
    };
    if (editStreamId) {
      const { data: contributors } = await getContributors(editStreamId);
      return {
        data: {
          ...normalizedArticle,
          contributors: uniq(contributors),
        },
      };
    }
    return {
      data: normalizedArticle,
    };
  }),
}));
export default actions;
