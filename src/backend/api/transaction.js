import { db } from '../db';

const addTx = async (tx) => {
  try {
    const data = await db('transaction').insert(tx);
    console.log("addTx insert result", data);
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
  addTx,
};
