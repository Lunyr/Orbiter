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

const DEFAULT_TABLE_NAME = 'queue';

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
export default const init = (tableName) => {
  tableName = tableName ? tableName : DEFAULT_TABLE_NAME;

  // Create the queue table if it doesn't exist
  queue.schema.hasTable(tableName).then(function(exists) {
    if (!exists) {
      // Create queue table if it doesn't exist
      await queue.schema.createTable(tableName, (t) => {
        t.increments('job_id');
        t.timestamp('created').defaultTo(knex.fn.now());
        t.json('args');
      });
    }
  });

  return {
    put: async (obj) => {
      // Add the job to the DB
      return queue(tableName).insert({
        args: obj
      });
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

      // And return that bad boy
      return result[0];
    }
  };
};
