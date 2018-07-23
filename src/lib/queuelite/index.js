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
import { Job } from './Job';

const DEFAULT_TABLE_NAME = 'queue';
const DEFAULT_MAX_ATTEMPTS = 3;
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
export default (tableName, maxAttempts) => {
  tableName = tableName ? tableName : DEFAULT_TABLE_NAME;
  maxAttempts = maxAttempts ? maxAttempts : DEFAULT_MAX_ATTEMPTS;

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
        t.integer('progress').defaultTo(0);
        t.text('error');
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
    let result;
    try {
      result = await queue(tableName)
        .where({
          processed: false,
        })
        .where('attempts', '<', maxAttempts)
        .orderBy('attempts', 'ASC')
        .orderBy('created', 'ASC')
        .limit(1)
        .select();
    } catch (err) {
      // handle a race condition for initial table creation
      if (err.message.indexOf('no such table') > -1) {
        result = [];
      } else {
        throw err;
      }
    }

    if (result.length < 1) {
      return null;
    }

    // Set this job as processed
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
   * @returns Promise
   */
  const revert = async (job_id, progress, err) => {
    const job = await queue(tableName).where({
      job_id: job_id,
    }).select();

    if (job.length < 1) {
      log.warn({ job_id }, "Unalbe to revert job! Job not found.");
      return null;
    }
    log.debug({ progress }, "Reverting job!")
    return queue(tableName).where({
      job_id: job_id,
    }).update({
      processed: false,
      attempts: job[0].attempts += 1,
      error: err ? job[0].error + '\n' + err : job[0].error,
      progress: progress ? progress : job[0].progress,
    });
  }

  /**
   * complete marks a job as "processed" and sets the progress percent
   * @param {string} job_id is a unique string name for the job
   * @param {number} progress is the integer percent of completion
   * @returns Promise
   */
  const complete = async (job_id, progress) => {
    const job = await queue(tableName).where({
      job_id: job_id,
    }).select();

    if (job.length < 1) {
      log.warn({ job_id }, "Unalbe to update job! Job not found.");
      return null;
    }

    // Processed should already have been set by get()
    return queue(tableName).where({
      job_id: job_id,
    }).update({
      progress: progress
    });
  };

  /**
   * process will continually process all "unprocessed" jobs in the queue using
   *  the provided handler.  The handler should accept a Job object (see: ./Job)
   * @param {function} handler is the function that will process each job
   * @returns ?
   */
  const process = async (handler) => {
    let interval = 5;
    const processOne = async (handler) => {
      console.log("PINGPNG PINGPNG PINGPNG PINGPNG PINGPNG");
      const record = await get();
      if (record) {
        log.debug({ job_id: record.job_id }, "Processing record");
        const job = new Job(record);
        try {
          await handler(job);
          if (job.jobProgress < 100) {
            log.warning({ percentComplete: job.jobProgress }, "Job incomplete.  Reverting...");
            await revert(job.job_id, job.jobProgress, "Unknown error. Progress not 100%");
          } else {
            log.debug({ percentComplete: job.jobProgress }, "Job complete.");
            await complete(job.job_id, job.jobProgress);
          }
        } catch (err) {
          log.error(err.message);
          await revert(job.job_id, job.jobProgress, err.message);
        }
        // Full speed ahead
        interval = 5;
      } else {
        log.debug({ record }, "No record to process");
        // Slow down if we've run out of things
        interval = 3000;
      }
      setTimeout(processOne.bind(null, handler), interval);
    };
    setTimeout(processOne.bind(null, handler), interval);
  };

  return {
    put,
    get,
    revert,
    process,
  };
};
