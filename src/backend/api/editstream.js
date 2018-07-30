import { db } from '../db';
import { ProposalState } from '../../shared/constants';

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

export const getArticles = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const data = await db('edit_stream').innerJoin(
      'proposal',
      'edit_stream_id',
      'edit_stream_id'
    ).where({
      proposal_state_id: ProposalState.ACCEPTED
    }).select();
    console.log("getArticles result", data);
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

export const updateEditStream = async (edit_stream_id, esObj) => {
  try {
    const data = await db('edit_stream').where({
      edit_stream_id
    }).update(esObj);
    console.log("updateEditStream insert result", data);
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
