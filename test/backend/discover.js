const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const api = require('../../build/backend/api');
const mock = require('../mock');

const {
    getDiscover,
} = api;

describe('Discover Data API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should get discover data from IPFS', async () => {
    const result = await getDiscover();
    assert.isTrue(result.success, result.error);

    assert.equal(typeof result.data, 'object');
    assert.isAbove(result.data.en.categories.length, 0);
  }).timeout(30000);
});