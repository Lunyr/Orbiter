import { db } from '../db';

export const addEvent = async (ev) => {
  try {
    const data = await db('event').insert(ev);
    console.log("addEvent insert result", data);
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
