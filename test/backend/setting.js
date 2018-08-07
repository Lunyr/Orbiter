const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const api = require('../../build/backend/api');
const mock = require('../mock');

const {
    getUserSettings,
    setUserSetting,
} = api;

describe('Settings API', () => {
  before(async () => {
    await mock.mockUp(db);
  });

  it('should set a setting', async () => {
    const SETTING_NAME = 'privacy.errorReporting';
    const SETTING_VALUE = false;

    const origSettings = await getUserSettings(mock.ADDRESS1);
    assert.isOk(origSettings.success, origSettings.error);
    assert.equal(origSettings.data.length, 0, "User should not have settings yet");

    const setResult = await setUserSetting(mock.ADDRESS1, SETTING_NAME, SETTING_VALUE);
    assert.isOk(setResult.success, setResult.error);

    const afterSettings = await getUserSettings(mock.ADDRESS1);
    assert.isOk(afterSettings.success, afterSettings.error);
    assert.equal(afterSettings.data.length, 1, "User should have one setting");
    assert.equal(afterSettings.data[0].name, SETTING_NAME, "Setting name is wrong");
    assert.equal(afterSettings.data[0].value, SETTING_VALUE, "Setting value is wrong");
  });
});