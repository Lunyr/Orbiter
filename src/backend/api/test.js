import { db } from '../db';

const readAll = async () => {
  try {
    const data = await db('test');
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
  readAll,
};
