const assert = require('chai').assert;
const { db } = require('../../build/backend/db');
const api = require('../../build/backend/api');
const mock = require('../mock');
const { settings, loadUserSettings } = require('../../build/shared/settings');
const { web3 } = require('../../build/shared/web3');

const {
    setUserSetting,
} = api;

describe('User Settings', () => {
  const SETTING_NAME = 'privacy.errorReporting';
  const SETTING_VALUE = false;

  before(async () => {
    await mock.mockUp(db);
    await db('setting').insert({
      hashed_address: web3.utils.sha3(mock.ADDRESS1),
      name: SETTING_NAME,
      value: SETTING_VALUE,
    });
  });

  it('should have default setting of error reporting as true', async () => {
    assert.isTrue(settings.privacy.errorReporting);
  });

  it('should load user settings from DB', async () => {
    const newSettings = await loadUserSettings(mock.ADDRESS1);
    assert.isFalse(settings.privacy.errorReporting);
  }).timeout(5000);
});