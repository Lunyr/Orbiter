import { db } from '../db';

export const addTx = async (tx) => {
  try {
    const data = await db('transaction').insert(tx);
    log.debug({ data }, "addTx result");
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

export const getAddressByTx = async (txHash) => {
  try {
    const data = await db('transaction').where({
      hash: txHash
    }).select('from_address');

    let addr = null;
    if (data.length > 0) {
      addr = data[0].from_address;
    }

    return {
      success: true,
      data: addr,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
