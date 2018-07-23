import { db } from '../db';

export const getEditStream = async (editStreamId) => {
  try {
    const data = await db('edit_stream').where({
      edit_stream_id: editStreamId
    }).select();
    console.log("getEditStream result", data);
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
    console.log("addEditStream insert result", data);
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
