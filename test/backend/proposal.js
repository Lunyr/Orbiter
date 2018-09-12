const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const {
  getProposal,
  getDirtyProposals,
  addProposal,
  updateProposal,
  rejectProposal,
  acceptProposal,
  expireProposal,
  getProposalsWrittenBy,
  getProposalsInReviewBy,
  getProposalsInReview,
} = require('../../build/backend/api');
const mock = require('../mock');
const { ProposalState } = require('../../build/shared/constants');

describe('Proposal Data API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should get a proposal', async () => {
    const result = await getProposal(1);
    assert(result.success, result.error);
    assert.isNotNull(result.data, 'Should have received one proposal');
    assert.equal(result.data.id, 1, 'Should have received one proposal');

    // Check some random values
    // TODO: fill this out to match the mocked proposal
    assert.equal(result.data.state, ProposalState.ACCEPTED);
    assert.equal(result.data.fromAddress, mock.ADDRESS1);
    assert.equal(result.data.editStreamId, 1);
    assert.equal(result.data.dirty, false);
  });

  it('should add and get a dirty proposal', async () => {
    const addResult = await addProposal({
      id: 101,
      state: ProposalState.IN_REVIEW,
      editStreamId: 1,
      dirty: true,
      fromAddress: mock.ADDRESS2,
      lang: 'en',
      uuid: mock.UUID2,
      title: 'Dirty Proposal',
      megadraft: '[]',
    });
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data[0], 101, 'Should have returned an ID');

    const result = await getDirtyProposals();
    assert(result.success, result.error);
    assert.isAbove(result.data.length, 0, 'Should have returned at least one dirty proposal');
  });

  it('should update a proposal', async () => {
    const beforeResult = await getProposal(101);
    assert(beforeResult.success, beforeResult.error);
    assert.isNotNull(beforeResult.data, 'Should have received one proposal');
    assert.equal(beforeResult.data.id, 101, 'Should have returned a proposal');
    assert.equal(beforeResult.data.dirty, true, 'Should have returned a dirty proposal');

    const updateResult = await updateProposal(101, {
      dirty: false,
    });
    assert(updateResult.success, updateResult.error);
    assert.isAbove(updateResult.data, 0, 'Should have updated at least one row');

    const afterResult = await getProposal(101);
    assert(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, 'Should have received one proposal');
    assert.equal(afterResult.data.id, 101, 'Should have returned a proposal');
    assert.equal(afterResult.data.dirty, false, 'Should have returned a non-dirty proposal');
  });

  it('should accept a proposal', async () => {
    const beforeResult = await getProposal(101);
    assert(beforeResult.success, beforeResult.error);
    assert.isNotNull(beforeResult.data, 'Should have received one proposal');
    assert.equal(beforeResult.data.id, 101, 'Should have returned a proposal');
    assert.equal(beforeResult.data.state, ProposalState.IN_REVIEW, 'Proposal should be IN_REVIEW');

    const acceptResult = await acceptProposal(101);
    assert(acceptResult.success, acceptResult.error);
    assert.isAbove(acceptResult.data, 0, 'Should have updated at least one row');

    const afterResult = await getProposal(101);
    assert(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, 'Should have received one proposal');
    assert.equal(afterResult.data.id, 101, 'Should have returned a proposal');
    assert.equal(
      afterResult.data.state,
      ProposalState.ACCEPTED,
      'Proposal should have been ACCEPTED',
    );
  });

  it('should reject a proposal', async () => {
    const addResult = await addProposal({
      id: 102,
      state: ProposalState.IN_REVIEW,
      editStreamId: 40,
      dirty: false,
      fromAddress: mock.ADDRESS2,
      lang: 'en',
      uuid: mock.UUID2,
      title: 'Rejected Proposal',
      megadraft: '[]',
    });
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data[0], 102, 'Should have returned an ID');

    const acceptResult = await rejectProposal(102);
    assert(acceptResult.success, acceptResult.error);
    assert.isAbove(acceptResult.data, 0, 'Should have updated at least one row');

    const afterResult = await getProposal(102);
    assert(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, 'Should have received one proposal');
    assert.equal(afterResult.data.id, 102, 'Should have returned a proposal');
    assert.equal(
      afterResult.data.state,
      ProposalState.REJECTED,
      'Proposal should have been REJECTED',
    );
  });

  it('should expire a proposal', async () => {
    const addResult = await addProposal({
      id: 103,
      state: ProposalState.IN_REVIEW,
      editStreamId: 50,
      dirty: false,
      fromAddress: mock.ADDRESS2,
      lang: 'en',
      uuid: mock.UUID2,
      title: 'Rejected Proposal',
      megadraft: '[]',
    });
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data[0], 103, 'Should have returned an ID');

    const acceptResult = await expireProposal(103);
    assert(acceptResult.success, acceptResult.error);
    assert.isAbove(acceptResult.data, 0, 'Should have updated at least one row');

    const afterResult = await getProposal(103);
    assert(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, 'Should have received one proposal');
    assert.equal(afterResult.data.id, 103, 'Should have returned a proposal');
    assert.equal(
      afterResult.data.state,
      ProposalState.EXPIRED,
      'Proposal should have been EXPIRED',
    );
  });

  it('should return proposals written by...', async () => {
    const result = await getProposalsWrittenBy(mock.ADDRESS2);
    assert(result.success, result.error);
    assert.isAbove(result.data.length, 0, 'Should have returned some proposals');
  });

  it('should return proposals in-review by...', async () => {
    const addResult = await addProposal({
      id: 104,
      state: ProposalState.IN_REVIEW,
      editStreamId: 50,
      dirty: false,
      fromAddress: mock.ADDRESS1,
      lang: 'en',
      uuid: mock.UUID2,
      title: 'Rejected Proposal',
      megadraft: '[]',
    });
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data[0], 104, 'Should have returned an ID');

    const result = await getProposalsInReviewBy(mock.ADDRESS1);
    assert(result.success, result.error);
    assert.isAbove(result.data.length, 0, 'Should have returned some proposals');
  });

  it('should return proposals in-review', async () => {
    const result = await getProposalsInReview();
    assert(result.success, result.error);
    assert.isAbove(result.data.length, 0, 'Should have returned some proposals');
  });

  it('should properly serialize and deserialize additonal_content', async () => {
    const thisProposalID = 105;
    const additional = [{ something: true }];
    const addResult = await addProposal({
      id: thisProposalID,
      state: ProposalState.IN_REVIEW,
      editStreamId: 50,
      dirty: false,
      fromAddress: mock.ADDRESS1,
      lang: 'en',
      uuid: mock.UUID2,
      title: 'Additional Content Thing',
      megadraft: '[]',
      additionalContent: JSON.stringify(additional),
    });
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data[0], thisProposalID, 'Should have returned an ID');

    const afterResult = await getProposal(thisProposalID);
    assert(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, 'Should have received one proposal');
    assert.equal(afterResult.data.id, thisProposalID, 'Should have returned a proposal');
    assert.isArray(
      afterResult.data.additionalContent,
      "Proposal's additionalContent should be an Array",
    );
  });
});
