const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const constants = require('../../build/shared/constants');
const api = require('../../build/backend/api');
const mock = require('../mock');

const { ProposalState } = constants;
const {
    searchArticles,
} = api;

describe('Search API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should find an article by search term', async () => {
    const searchTerm = 'article';
    const result = await searchArticles(searchTerm);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 1, 'Should have found one article');
    assert.isTrue(
      result.data[0].title.indexOf(searchTerm) > -1
      || result.data[0].description.indexOf(searchTerm) > -1
      || result.data[0].megadraft.indexOf(searchTerm) > -1,
      'Search term not found in expected fields'
    );
  });

  it('should find articles with multiple search terms', async () => {
    const searchTerm = 'bunch proposals';
    const result = await searchArticles(searchTerm);
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data.length, 1, 'Should have found multiple articles');
  });
});