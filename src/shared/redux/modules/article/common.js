import uniq from 'lodash/uniq';
import { getContributors } from '../../../../backend/api';

export const includeContributors = async ({ data: article }) => {
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
};
