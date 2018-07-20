/**
 * This library sets up a simple queue system using SQLite.
 * 
 * Usage
 * -----
 * const queue = require('pubsublite');
 * const q = queue('myQueue');
 * await q.put({
 *   title: "My Job Title",
 *   other: true
 * });
 * const job = q.get();
 */

import knex from 'knex';
import { getLogger } from '../logger';

const DEFAULT_TABLE_NAME = 'queue';
const log = getLogger('queuelite');

export const queue = knex({
  client: 'sqlite3',
  connection: {
    filename: './eventqueue.sqlite',
  },
});

/**
 * Initialize the queue using the provided name
 * @param {string} tableName is the name of queue that will be used as a table name
 * @returns {object} an object with methods to use on the queue (e.g. put, get)
 */
export default (tableName) => {
  tableName = tableName ? tableName : DEFAULT_TABLE_NAME;

  log.debug("QueueLite Start");

  // Create the queue table if it doesn't exist
  queue.schema.hasTable(tableName).then(async (exists) => {
    if (!exists) {
      // Create queue table if it doesn't exist
      await queue.schema.createTable(tableName, (t) => {
        t.string('job_id');
        t.timestamp('created').defaultTo(queue.fn.now());
        t.boolean('processed').defaultTo(false);
        t.integer('attempts').defaultTo(0);
        t.json('args');

        t.unique('job_id');
      });
    }
  });

  /**
   * put adds a job to the queue
   * @param {string} job_id is a unique string name for the job
   * @param {object} obj is an object with any job data you want passed on
   * @returns null?
   */
  const put = async (job_id, obj) => {
    if (typeof job_id === 'undefined' || !job_id) {
      throw new Error('job_id is required');
    }
    log.debug({ job_id }, "Queue PUT");
    // TODO: add a check to make sure job_id doesn't exist
    let result;
    try {
      // Add the job to the DB
      result = await queue(tableName).insert({
        job_id: job_id,
        args: JSON.stringify(obj)
      });
    } catch (err) {
      if (typeof err.message !== 'undefined' && err.message.indexOf('UNIQUE') > -1) {
        log.debug({ job_id }, "Job already added")
        result = null;
      } else {
        throw err;
      }
    }
    log.debug({ result }, "QueueLite.put() inserted");
    return result;
  };

  /**
   * get returns a job from the queue and sets it as "processed"
   * @returns {object}
   */
  const get = async () => {
    // Get the oldest entry
    const result = await queue(tableName)
      .where({
        processed: false,
      })
      .orderBy('created', 'ASC')
      .limit(1)
      .select();

    // Delete the entry we just got
    await queue(tableName).where({
      job_id: result[0].job_id
    }).delete();

    await queue(tableName).where({
      job_id: result[0].job_id
    }).update({
      processed: true
    });

    // And return that bad boy
    return result[0];
  };

  /**
   * revert sets a "processed" job as "not processed" in case of job failure
   * @param {string} job_id is a unique string name for the job
   * @returns null?
   */
  const revert = async (job_id) => {
    const job = queue(tableName).where({
      job_id: job_id
    }).select();
    return queue(tableName).where({
      job_id: job_id,
      attempts: job[0].attempts += 1
    }).update({
      processed: false
    });
  }

  /**
   * process will continually process all "unprocessed" jobs in the queue using
   *  the provided handler.  The handler should accept an object with job_id and
   *  the original arguments: { job_id: "whatever", args: { one: 1 }}
   * @param {function} handler is the function that will process each job
   * @returns ?
   */
  const process = async (handler) => {
    let isWaiting = false;
    while (true) {
      if (!isWaiting) {
        const job = await get();
        if (job) {
          handler(job);
        } else {
          isWaiting = true;
          setTimeout(() => {
            isWaiting = false;
          }, 3000);
        }
      }
    }
  };

  return {
    put,
    get,
    revert,
    process,
  };
};
