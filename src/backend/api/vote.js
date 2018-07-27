import { db } from '../db';

export const getVote = async (voteId) => {
  try {
    const data = await db('vote').where({
      vote_id: voteId
    }).select();
    console.log("getVote result", data);
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

export const getDirtyVotes = async () => {
  try {
    const data = await db('vote').where({
      dirty: true
    }).select();
    console.log("getDirtyVotes result", data);
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

export const addVote = async (voteObj) => {
  try {
    const data = await db('vote').insert(voteObj);
    console.log("addVote insert result", data);
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

export const updateVote = async (voteId, voteObj) => {
  try {
    const data = await db('vote').where({
      vote_id: voteId
    }).update(voteObj);
    console.log("updateVote result", data);
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
