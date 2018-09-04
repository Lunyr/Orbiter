const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const api = require('../../build/backend/api');
const mock = require('../mock');

const {
  getFeed,
  getFeedArticlesAccepted,
  getFeedArticlesInReview,
  getFeedVotes
} = api;

describe('Feed API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should get votes for the feed', async () => {
    const result = await getFeedVotes(20, 0);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 20, "Should have returned 20 votes");
    result.data.forEach(v => {
      assert.equal(v.type, 'vote', "Wrong type");
      assert.exists(v.createdAt, "Missing createdAt");
      assert.exists(v.proposal, "Missing proposal");
      assert.exists(v.proposal.title, "Missing title");
    });
  });

  it('should get accepted articles for the feed', async () => {
    const result = await getFeedArticlesAccepted(20, 0);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 20, "Should have returned 20 articles");
    result.data.forEach(a => {
      assert.equal(a.type, 'article', "Wrong type");
    });
  });

  it('should get accepted articles for the feed', async () => {
    const result = await getFeedArticlesInReview(20, 0);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 20, "Should have returned 20 proposals");
    result.data.forEach(a => {
      assert.equal(a.type, 'review', "Wrong type");
    });
  });

  it('should get a combined feed', async () => {
    const result = await getFeed(30, 0);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 30, "Should have returned 60 items for the feed");

    let hasArticlesAccepted = false,
      hasArticlesInReview = false,
      hasVotes = false;

    result.data.forEach(a => {
      if (!hasArticlesAccepted && a.type === 'article')
        hasArticlesAccepted = true;
      else if (!hasArticlesInReview && a.type === 'review')
        hasArticlesInReview = true;
      else if (!hasVotes && a.type === 'vote')
        hasVotes = true;
    });

    assert.isTrue(
      hasVotes && hasArticlesAccepted && hasArticlesInReview,
      "Did not return at least one of each type for the feed"
    );
  });
});