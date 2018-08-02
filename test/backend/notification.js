const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const api = require('../../build/backend/api');
const mock = require('../mock');

const {
  addNotification,
  getNotifications,
  getUnread,
  markRead
} = api;

describe('Notification Data API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should add and fetch a notification', async () => {
    // Add a notification
    const addResult = await addNotification(
      mock.ADDRESS1,
      'TestEvent',
      {
        a: 1,
        b: 2
      }
    );
    assert(addResult.success, addResult.error);

    // See if it exists now
    const getResult = await getNotifications(mock.ADDRESS1);
    assert(addResult.success, addResult.error);
    assert.equal(addResult.data.length, 1, "There should be one notification for this address");
  });

  it('should mark a notification as read', async () => {
    // Get current unread notifications (should be one from last test)
    const beforeResult = await getUnread(mock.ADDRESS1);
    assert(beforeResult.success, beforeResult.error);
    assert.equal(beforeResult.data.length, 1, "There should be one notification for this address");

    // Mark it read
    const markResult = await markRead(beforeResult.data[0].id);
    assert(markResult.success, markResult.error);

    // Check and make sure we have no more unread notifications
    const afterResult = await getUnread(mock.ADDRESS1);
    assert(afterResult.success, afterResult.error);
    assert.equal(afterResult.data.length, 0, "There should not be any unread notifications for this address");
  });
});