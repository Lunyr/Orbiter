const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const {
  getVote,
  getDirtyVotes,
  updateVote,
  addVote,
  getProposalVoteStats,
  getProposalVotes,
  userVotedOnProposal,
  getUsersRecentVotes,
} = require('../../build/backend/api');
const mock = require('../mock');

describe('Vote Data API', () => {

  const DIRTY_VOTE_ID = 150;

  before(async () => {
    await mock.mockUp(db);
  });

  it('should get a vote', async () => {
    const result = await getVote(1);
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data.length, 0, "Should have received at least one vote record");
    assert.equal(result.data[0].proposalId, 2);
    assert.equal(result.data[0].fromAddress, mock.ADDRESS1);
    assert.isOk(result.data[0].accepted);
  });

  it('should add a vote', async () => {
    const addResult = await addVote({
      id: DIRTY_VOTE_ID,
      proposalId: 49,
      fromAddress: mock.ADDRESS2,
      accepted: false,
      dirty: true,
      checklist: '[]',
      notes: 'immavote',
    });
    assert.isTrue(addResult.success, addResult.error);
    assert.equal(addResult.data[0], DIRTY_VOTE_ID, "Should have received an ID of 100");

    const result = await getVote(DIRTY_VOTE_ID);
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data.length, 0, "Should have received at least one vote record");
    assert.equal(result.data[0].id, DIRTY_VOTE_ID);
    assert.equal(result.data[0].proposalId, 49);
    assert.equal(result.data[0].fromAddress, mock.ADDRESS2);
    assert.isNotOk(result.data[0].accepted);
  });

  it('should get dirty votes', async () => {
    const result = await getDirtyVotes();
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data.length, 0, "Should have received at least one dirty vote record");
    assert.equal(result.data[0].id, DIRTY_VOTE_ID);
  });

  it('should update a vote', async () => {
    const beforeResult = await getVote(DIRTY_VOTE_ID);
    assert.isTrue(beforeResult.success, beforeResult.error);
    assert.isAbove(beforeResult.data.length, 0, "Should have received at least one vote record");
    assert.isOk(beforeResult.data[0].dirty);

    const result = await updateVote(DIRTY_VOTE_ID, {
      dirty: false,
    });
    assert.isTrue(result.success, result.error);
    assert.isAbove(result.data, 0, "Should have updated at least one vote record");

    const afterResult = await getVote(DIRTY_VOTE_ID);
    assert.isTrue(afterResult.success, afterResult.error);
    assert.isAbove(afterResult.data.length, 0, "Should have received at least one vote record");
    assert.equal(afterResult.data[0].fromAddress, mock.ADDRESS2);
    assert.isNotOk(afterResult.data[0].dirty);
  });

  it('should get vote statistics for a proposal', async () => {
    const result = await getProposalVoteStats(2, mock.ADDRESS1);
    assert.isTrue(result.success, result.error);
    assert.equal(typeof result.data, 'object', "Should have received an object");
    assert.equal(result.data.pending, 0, "Should not have pending votes");
    assert.equal(result.data.complete, 3, "Should have 3 complete votes");
    assert.equal(result.data.user, 3, "Should have 3 votes by user");
    assert.equal(result.data.total, 3, "Should have 3 total votes");
  });

  it('should get votes for a proposal', async () => {
    const result = await getProposalVotes(2);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 3, "Should have received 3 votes");
    assert.isOk(result.data[0].accepted, "Should have an accepted vote");
    assert.equal(result.data[0].fromAddress, mock.ADDRESS1, "Vote should have come from ADDRESS1");
    assert.isOk(result.data[1].accepted, "Should have an accepted vote");
    assert.equal(result.data[1].fromAddress, mock.ADDRESS1, "Vote should have come from ADDRESS1");
    assert.isOk(result.data[2].accepted, "Should have an accepted vote");
    assert.equal(result.data[2].fromAddress, mock.ADDRESS1, "Vote should have come from ADDRESS1");
  });

  it('should show if a user voted on a proposal', async () => {
    const firstResult = await userVotedOnProposal(2, mock.ADDRESS1);
    assert.isTrue(firstResult.success, firstResult.error);
    assert.equal(typeof firstResult.data, 'boolean', "Should have received a boolean as data");
    assert.isOk(firstResult.data, "User should have voted on proposal");

    const secondResult = await userVotedOnProposal(2, mock.ADDRESS2);
    assert.isTrue(secondResult.success, secondResult.error);
    assert.equal(typeof secondResult.data, 'boolean', "Should have received a boolean as data");
    assert.isNotOk(secondResult.data, "User should have voted on proposal");
  });

  it('should show a user\'s recent votes', async () => {
    const result = await getUsersRecentVotes(mock.ADDRESS1);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data.length, 3, "Should have received some votes");
    assert.isOk(result.data[0].accepted, "Should have an accepted vote");
    assert.isOk(result.data[1].accepted, "Should have an accepted vote");
    assert.isOk(result.data[2].accepted, "Should have an accepted vote");
  });
});