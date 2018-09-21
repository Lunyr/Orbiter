import os from 'os';
import path from 'path';
import knex from 'knex';
import { getLogger } from '../lib/logger';
import { default as settings } from '../shared/defaults';

const log = getLogger('db');

const getDateString = () => {
  const dt = new Date();
  return `${dt.getFullYear()}${dt.getMonth()}${dt.getDate()}${dt.getHours()}${dt.getMinutes()}${dt.getMilliseconds()}`;
};

const getDBByEnvironment = () => {
  return process.env.NODE_ENV === 'test'
    ? path.join(os.tmpdir(), `test-orbiter-${getDateString()}.sqlite`)
    : path.join(settings.configDir, `orbiter.${process.env.NODE_ENV}.sqlite`);
};

const DB_FILE = getDBByEnvironment();

log.info({ DB_FILE }, 'Initializing the database...');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: DB_FILE,
    dateStrings: true,
  },
  pool: {
    afterCreate: (conn, done) => {
      conn.run('PRAGMA busy_timeout = 6000;', (err, res) => {
        done(err, conn);
      });
    }
  },
  useNullAsDefault: true,
  acquireConnectionTimeout: 5000,
});

export { db };
