import _ from 'lodash';
import Web3 from 'web3';
import settings from './defaults';
import { db } from '../backend/db';

/**
 * User Settings
 * =============
 * User settings(other than defaults) are stored in sqlite in a key/value type
 * structure.  Use the data layer(API) call setUserSetting() to set any settings.
 * The keys(name) of each setting should be a dot notation matching the defaults
 * settings structure.  For instance, to set the JSON-RPC provider, you would
 * set the setting with this key: 'jsonRPC.current' to the value of the HTTP
 * endpoint.
 *
 * Example
 * =======
 *    await setUserSetting(
 *      '0xdeadbeef...',
 *      'jsonRPC.current',
 *      'http://localhost:8545/'
 *    );
 */

/**
 * loadUserSettings will overlay a user's saved settings from SQLite onto the
 * currently running settings.  It also returns the settings object should that
 * be useful to you for some reason.
 * @param {string} address it the user's address the settings are saved as
 * @returns {object} the settings object
 */
export const loadUserSettings = async (address) => {
  const settingResults = await await db('setting').where({
    hashed_address: Web3.utils.sha3(address),
  });
  if (settingResults.length < 1) {
    // log.debug('User has no settings to load');
    return;
  }

  // Overlay the DB results onto our defaults
  settingResults.map((s) => {
    if (_.get(settings, s.name) !== 'undefined') {
      let val = s.value;
      if (typeof _.get(settings, s.name) === 'boolean') {
        // Bools in SQLite are 1/0, so do a little coaxing
        if (
          (typeof s.value === 'string' && s.value === '1') ||
          (typeof s.value !== 'string' && s.value)
        ) {
          val = true;
        } else {
          val = false;
        }
      }
      _.set(settings, s.name, val);
    }
  });
  return settings;
};

export { settings };
