import { clearUndefined } from './utils';

/**
 * toEditStream takes an edit stream object and assembles a draft object that
 * the frontend exects
 * @param {object} - The edit stream to convert
 * @return {object} - The newly assembled raw edit stream object
 */
export const toEditStream = (editStream) => {
  return {
    id: editStream.edit_stream_id,
    created: editStream.created,
    updated: editStream.updated,
    lang: editStream.lang,
    title: editStream.title
  }
};

/**
 * fromEditStream takes an edit stream object from the frontend and assembles
 * a draft object that the DB exects
 * @param {object} - The edit stream to convert
 * @return {object} - The newly assembled raw edit stream object
 */
export const fromEditStream = (editStream, isPartial) => {
  let result = {
    edit_stream_id: editStream.id,
    created: editStream.created,
    updated: editStream.updated,
    lang: editStream.lang,
    title: editStream.title
  }
  if (isPartial) result = clearUndefined(result);
  return result;
};