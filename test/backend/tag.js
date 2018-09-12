const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const {
  getTag,
  getTags,
  getActiveTags,
  addTag,
  activateTag,
  getTagProposals,
  addTagProposal,
  associateTag,
  getTagAssociation
} = require('../../build/backend/api');
const mock = require('../mock');

describe('Tag Data API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should get a tag', async () => {
    const result = await getTag('first');
    assert.isTrue(result.success, result.error);
    assert.isNotNull(result.data, "Should have one result");
  });

  it('should get all tags', async () => {
    const result = await getTags();
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 2, "Should have received two tags");
  });

  it('should get all active tags', async () => {
    const result = await getActiveTags();
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 1, "Should have received one tag");
  });

  it('should add a tag', async () => {
    const beforeResult = await getTag('last');
    assert.isTrue(beforeResult.success, beforeResult.error);
    assert.isNull(beforeResult.data, "Should have zero results");

    const result = await addTag('last');
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data[0], 0, "Should have received an ID");

    const afterResult = await getTag('last');
    assert.isTrue(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, "Should have one result");
    assert.isNotOk(afterResult.data.active);
  });

  it('should add and get tag proposals', async () => {
    const tagResult = await getTag('last');
    assert.isTrue(tagResult.success, tagResult.error);
    assert.isNotNull(tagResult.data, "Should have one result");
    const beforeResult = await getTagProposals(tagResult.data.id);
    assert.isTrue(beforeResult.success, beforeResult.error);
    assert.equal(beforeResult.data.length, 0, "Should have received no tag proposals");

    const result = await addTagProposal(tagResult.data.id, mock.ADDRESS1);
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data[0], 0, "Should have gotten an ID");

    const afterResult = await getTagProposals(tagResult.data.id);
    assert.isTrue(afterResult.success, afterResult.error);
    assert.equal(afterResult.data.length, 1, "Should have received one tag proposal");
    assert.equal(afterResult.data[0].fromAddress, mock.ADDRESS1);

    const result2 = await addTagProposal(tagResult.data.id, mock.ADDRESS2);
    assert.isTrue(result2.success, result2.error);
    assert.isAbove(result2.data[0], 0, "Should have gotten an ID");

    const finalResult = await getTagProposals(tagResult.data.id);
    assert.isTrue(finalResult.success, finalResult.error);
    assert.equal(finalResult.data.length, 2, "Should have received two tag proposals");
    assert.equal(finalResult.data[0].fromAddress, mock.ADDRESS1);
    assert.equal(finalResult.data[1].fromAddress, mock.ADDRESS2);
  });

  it('should activate a tag', async () => {
    const beforeResult = await getTag('last');
    assert.isTrue(beforeResult.success, beforeResult.error);
    assert.isNotNull(beforeResult.data, "Should have one result");

    const result = await activateTag('last');
    assert.isTrue(result.success, result.error);
    assert.equal(result.data, 1, "Should have updated one row");

    const afterResult = await getTag('last');
    assert.isTrue(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, "Should have one result");
    assert.isOk(afterResult.data.active);
  });

  it('should associate a tag', async () => {
    const tagResult = await getTag('last');
    assert.isTrue(tagResult.success, tagResult.error);
    assert.isNotNull(tagResult.data, "Should have one result");

    const beforeResult = await getTagAssociation('last', 1);
    assert.isTrue(beforeResult.success, beforeResult.error);
    assert.equal(beforeResult.data.length, 0, "Should have received zero results");

    const result = await associateTag(tagResult.data.id, 1);
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data[0], 0, "Should have gotten an ID");

    const afterResult = await getTagAssociation('last', 1);
    assert.isTrue(afterResult.success, afterResult.error);
    assert.equal(afterResult.data.length, 1, "Should have received one tag association");
    assert.equal(afterResult.data[0].editStreamId, 1);
  });
});