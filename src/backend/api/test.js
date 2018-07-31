import { db } from '../db';

export const readAll = async () => {
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
