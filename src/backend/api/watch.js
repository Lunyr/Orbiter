import { db } from '../db';
import { TxState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';
import { toTxStatus, fromTxStatus } from '../assemblers';

const log = getLogger('api-watch');

export const addWatch = async (obj) => {
  try {
    obj = fromTxStatus(obj);
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
    const result = await db('watch').where({ hash: txHash });

    const data = result.map(w => toTxStatus(w));

    return {
      success: true,
      data: data.length > 0 ? data[0] : null,
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
    const result = await db('watch').where({
      transaction_state_id: TxState.PENDING
    }).where('created', '<=', new Date(new Date() - (5 * 60 * 1000)).toISOString());

    const data = result.map(w => toTxStatus(w));

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
