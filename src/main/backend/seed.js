export default async (db) => {
  try {
    // Drop table if exists
    await db.schema.dropTableIfExists('test');

    // Create a table
    await db.schema.createTable('test', (t) => {
      t.bigincrements('id');
      t.string('title');
    });

    // Insert some datas
    await db('test').insert({ title: 'foo' });
    await db('test').insert({ title: 'bar' });
    await db('test').insert({ title: 'baz' });
  } catch (error) {
    console.error(error);
  }
};
