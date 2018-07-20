import { db } from '../db';

const addWatch = async (obj) => {
  try {
    const data = await db('watch').insert(obj);
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

const getWatch = async (txHash) => {
  try {
    const data = await db('watch').where({ hash: txHash });
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

const setWatchState = async (txHash, txState) => {
  try {
    const data = await db('watch')
      .where({ hash: txHash })
      .update({ transaction_state_id: txState });
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

export default {
  getWatch,
  addWatch,
  setWatchState,
};
