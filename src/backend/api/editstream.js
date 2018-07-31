import { db } from '../db';

export const getEditStream = async (editStreamId) => {
  try {
    const data = await db('edit_stream').where({
      edit_stream_id: editStreamId
    }).select();
    log.debug({ data }, "getEditStream result");
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const addEditStream = async (esObj) => {
  try {
    const data = await db('edit_stream').insert(esObj);
    log.debug({ data }, "addEditStream result");
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateEditStream = async (edit_stream_id, esObj) => {
  try {
    const data = await db('edit_stream').where({
      edit_stream_id
    }).update(esObj);
    log.debug({ data }, "updateEditStream result");
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
