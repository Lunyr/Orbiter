import { db } from '../db';
import { getLogger } from '../../lib/logger';
import { toEditStream, fromEditStream } from '../assemblers';

const log = getLogger('api-editstream');

export const getEditStream = async (editStreamId) => {
  try {
    const result = await db('edit_stream').where({
      edit_stream_id: editStreamId
    }).select();

    log.debug({ result }, "getEditStream result");

    const data = result.map(e => toEditStream(e));

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
    esObj = fromEditStream(esObj);
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

export const updateEditStream = async (editStreamId, esObj) => {
  try {
    esObj = fromEditStream(esObj, true);
    const data = await db('edit_stream').where({
      edit_stream_id: editStreamId
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
