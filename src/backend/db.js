import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './orbiter.sqlite',
  },
  useNullAsDefault: true
});

export { db };
