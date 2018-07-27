import { db } from '../db';
import { TxState } from '../../shared/constants';

export const addWatch = async (obj) => {
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

export const getWatch = async (txHash) => {
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

export const getPendingWatch = async () => {
  try {
    const data = await db('watch').where({
      transaction_state_id: TxState.PENDING
    }).where('created', '<=', new Date(new Date() - (5 * 60 * 1000)));
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

export const setWatchState = async (txHash, txState) => {
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
