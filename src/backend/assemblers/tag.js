import { clearUndefined } from './utils';

/**
 * toTag serializes a tag
 * @param {object} - The raw query results with the values we need
 * @return {object} - The newly assembled raw feed tag object
 */
export const toTag = (tag) => {
  return {
    id: tag.tag_id,
    active: tag.active,
    name: tag.name,
    proposers: [],
    articleCount: null,
  }
};

/**
 * toTag deserializes a tag for DB insertion
 * @param {object} - The raw query results with the values we need
 * @return {object} - The newly assembled raw feed tag object
 */
export const fromTag = (tag, isPartial = false) => {
  let result = {
    tag_id: tag.id,
    active: tag.active,
    name: tag.name
  };
  if (isPartial) result = clearUndefined(result);
  return result;
};
