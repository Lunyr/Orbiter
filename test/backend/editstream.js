const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const api = require('../../build/backend/api');
const mock = require('../mock');

const {
    getEditStream,
    addEditStream,
    updateEditStream
} = api;

describe('Edit Stream Data API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should fetch an edit stream', async () => {
    const result = await getEditStream(1);
    assert(result.success, result.error);
    assert.isNotNull(result.data, "Should have one result");
  });

  it('add an edit stream', async () => {
    const addResult = await addEditStream({
        id: 100,
        lang: 'en',
        title: 'Edit Stream One Hundred',
    });
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data[0], 100, "Should've returned ID 100");

    const result = await getEditStream(100);
    assert(result.success, result.error);
    assert.isNotNull(result.data, "Should have one result");
    assert.equal(result.data.id, 100);
    assert.equal(result.data.lang, 'en');
  });

  it('update an edit stream', async () => {
    const ID = 101;
    const ORIG_TITLE = 'Edit Stream';
    const NEW_TITLE = 'Edit Stream Has Been Edited';

    const addResult = await addEditStream({
        id: ID,
        lang: 'en',
        title: ORIG_TITLE,
    });
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data[0], ID, "Should've returned ID 100");

    const beforeResult = await getEditStream(ID);
    assert(beforeResult.success, beforeResult.error);
    assert.isNotNull(beforeResult.data, "Should have one result");
    assert.equal(beforeResult.data.id, ID);
    assert.equal(beforeResult.data.lang, 'en');
    assert.equal(beforeResult.data.title, ORIG_TITLE);

    const updateResult = await updateEditStream(ID, {
        title: NEW_TITLE,
    });
    assert(updateResult.success, updateResult.error);
    assert.equal(updateResult.data, 1, "Should've updated 1 row");

    const afterResult = await getEditStream(ID);
    assert(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, "Should have one result");
    assert.equal(afterResult.data.title, NEW_TITLE, "Should have updated the title");

  });
});