const _ = require('lodash');
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
    const SETTING_NAME = 'ipfs.port';
    const SETTING_VALUE = 5002;

    const origSettings = await getUserSettings(mock.ADDRESS1);
    assert.isOk(origSettings.success, origSettings.error);
    const originalLength = origSettings.data.length;

    const setResult = await setUserSetting(mock.ADDRESS1, SETTING_NAME, SETTING_VALUE);
    assert.isOk(setResult.success, setResult.error);

    const afterSettings = await getUserSettings(mock.ADDRESS1);
    assert.isOk(afterSettings.success, afterSettings.error);
    assert.isAbove(afterSettings.data.length, originalLength, "New setting was not added?");

    const newSetting = _.find(afterSettings.data, ['name', SETTING_NAME]);
    assert.equal(newSetting.name, SETTING_NAME, "Setting name is wrong");
    assert.equal(newSetting.value, SETTING_VALUE, "Setting value is wrong");
  });
});