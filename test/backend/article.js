const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const constants = require('../../build/shared/constants');
const api = require('../../build/backend/api');
const mock = require('../mock');

const { ProposalState } = constants;
const { getArticles, getCurrentArticle, getCurrentArticleByTitle, getContributors } = api;

describe('Article API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should get an article', async () => {
    const result = await getCurrentArticle(1);
    assert.isNotNull(result.data, 'Should have received one article');
    const article = result.data;

    assert.equal(article.id, 1, `proposal_id is incorrect`);
    assert.equal(article.state, ProposalState.ACCEPTED, `proposal_state_id is incorrect`);
    assert.equal(article.editStreamId, 1, `edit_stream_id is incorrect`);
    assert.equal(article.fromAddress, mock.ADDRESS1, `from_address is incorrect`);
    assert.equal(article.imageOffsetRatio, 0.1, `image_offset is incorrect`);
  });

  it('should get a paginated articles', async () => {
    const result = await getArticles();
    assert.equal(result.data.length, 25, `Unexpected result length on default`);

    // Get second page
    const result2 = await getArticles(null, 1);
    assert.equal(result2.data.length, 25, `Unexpected result length with page`);
    assert.notEqual(
      result2.data[0].id,
      result.data[0].id,
      `First and second results should be different. ${result.data[0].id} != ${result2.data[0].id}`,
    );

    // Get all 50
    const result3 = await getArticles(50);
    assert.equal(result3.data.length, 50, `Unexpected result length`);
    assert.equal(result3.data[0].id, result.data[0].id, 'Should be the same results');
  });

  it('should get an article by title', async () => {
    const result = await getCurrentArticleByTitle('Test');
    assert.isNotNull(result.data, 'Should have received one article');
    assert.equal(result.data.title, 'Test', 'Should have an with this title');
  });

  it('should get the contributors of an article', async () => {
    const result = await getContributors(1);
    assert.equal(result.data.length, 1, 'Should have one contributor');
    assert.equal(
      result.data[0],
      mock.ADDRESS1,
      `Should be the same as ADDRESS1. ${result.data[0].fromAddress}`,
    );
  });
});
