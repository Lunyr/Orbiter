const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const constants = require('../../build/shared/constants');
const api = require('../../build/backend/api');
const mock = require('../mock');

const { DraftState } = constants;
const {
    getDraft,
    getDraftByProposalId,
    setDraftToDraft,
    addDraft,
    editDraft,
} = api;

describe('Draft Data API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should add and fetch a draft', async () => {
    const addResult = await addDraft({
      editStreamId: 1,
      proposalId: 1,
      uuid: mock.UUID1,
      imageOffsetRatio: 2,
      heroImageHash: mock.HASH1,
      title: 'Edited Test',
      referenceMap: '[]',
      additionalContent: '[]',
      description: 'Edit to the test article',
      megadraft: '[]',
    });

    assert.equal(addResult.data[0], 1, "Should have inserted one row");

    const fetchResult = await getDraft(mock.UUID1);

    assert(fetchResult.success, fetchResult.error);
    assert.equal(fetchResult.data.length, 1);

    const draft = fetchResult.data[0];

    assert.equal(draft.editStreamId, 1);
    assert.equal(draft.proposalId, 1);
    assert.equal(draft.uuid, mock.UUID1);
    assert.equal(draft.heroImageHash, mock.HASH1);
    assert.equal(draft.state, DraftState.DRAFT);
    assert.equal(draft.title, 'Edited Test');
    assert.equal(draft.imageOffsetRatio, 2);
  });

  it('should update a draft', async () => {
    await addDraft({
      editStreamId: 1,
      proposalId: 1,
      uuid: mock.UUID2,
      imageOffsetRatio: 2,
      heroImageHash: mock.HASH1,
      title: 'Edited Test',
      referenceMap: '[]',
      additionalContent: '[]',
      description: 'Edit to the test article',
      megadraft: '[]',
    });

    const beforeResult = await getDraft(mock.UUID2);

    assert.equal(beforeResult.data.length, 1);

    const beforeDraft = beforeResult.data[0];

    assert.equal(beforeDraft.uuid, mock.UUID2);
    assert.equal(beforeDraft.imageOffsetRatio, 2);

    // Okay, now update it and make sure it took
    const updateResult = await editDraft(mock.UUID2, {
      imageOffsetRatio: 1
    });

    assert(updateResult.success, "Draft update failed");
    assert.equal(updateResult.data, 1, "Should have updated 1 row");

    const afterResult = await getDraft(mock.UUID2);

    assert.equal(afterResult.data.length, 1);

    const afterDraft = afterResult.data[0];

    assert.equal(afterDraft.imageOffsetRatio, 1);
    assert.equal(afterDraft.proposalId, 1);
    assert.equal(afterDraft.editStreamId, 1);
  });
})