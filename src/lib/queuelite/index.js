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
        t.boolean('processed').defaultTo(false),
        t.json('args');

        t.unique('job_id');
      });
    }
  });

  return {
    put: async (job_id, obj) => {
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
    },
    get: async () => {
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
    },
    revert: async (job_id) => {
      return queue(tableName).where({
        job_id: job_id
      }).update({
        processed: false
      });
    }
  };
};
