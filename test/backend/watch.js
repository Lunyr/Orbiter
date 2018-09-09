const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const {
  getWatch,
  getPendingWatch,
  addWatch,
  setWatchState
} = require('../../build/backend/api');
const mock = require('../mock');
const { TxState } = require('../../build/shared/constants');

describe('Watch Data API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should add and get a watch tx', async () => {
    const addResult = await addWatch({
      txHash: mock.HASH1,
      state: TxState.PENDING,
      read: false,
      proposalId: 1,
      fromAddress: mock.ADDRESS1,
      type: 'TestNotification',
      title: 'Test notification',
      createdAt: new Date(new Date() - (10 * 60 * 1000)).toISOString(),
    });
    assert.isTrue(addResult.success, addResult.error);
    assert.isAbove(addResult.data[0], 0, "Should have received an ID");

    const getResult = await getWatch(mock.HASH1);
    assert.isTrue(getResult.success, getResult.error);
    assert.isNotNull(getResult.data, "Should have one result");
    assert.equal(getResult.data.state, TxState.PENDING);
    assert.equal(getResult.data.fromAddress, mock.ADDRESS1);
  });

  it('should get pending watches', async () => {
    const getResult = await getPendingWatch();
    assert.isTrue(getResult.success, getResult.error);
    assert.isAbove(getResult.data.length, 0, "Should have received at least one watch record");
    assert.equal(getResult.data[0].state, TxState.PENDING);
  });

  it('should set a pending watch as complete', async () => {
    const beforeResult = await getWatch(mock.HASH1);
    assert.isTrue(beforeResult.success, beforeResult.error);
    assert.isNotNull(beforeResult.data, "Should have one result");
    assert.equal(beforeResult.data.state, TxState.PENDING);

    const result = await setWatchState(mock.HASH1, TxState.SUCCESS);
    assert.isTrue(result.success, result.error);
    assert.equal(result.data, 1, "Should have updated one row");

    const afterResult = await getWatch(mock.HASH1);
    assert.isTrue(afterResult.success, afterResult.error);
    assert.isNotNull(afterResult.data, "Should have one result");
    assert.equal(afterResult.data.state, TxState.SUCCESS);
  });
});