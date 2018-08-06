import { db } from '../db';
import { getLogger } from '../../lib/logger';

const log = getLogger('api-event');

export const addEvent = async (ev) => {
  try {
    const data = await db('event').insert(ev);
    log.debug({ data }, "addEvent result");
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
