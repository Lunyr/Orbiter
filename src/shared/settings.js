import _ from 'lodash';
import { default as settings } from './defaults';
import { getUserSettings } from '../backend/api';

/**
 * User Settings
 * =============
 * User settings(other than defaults) are stored in sqlite in a key/value type
 * structure.  Use the data layer(API) call setUserSetting() to set any settings.
 * The keys(name) of each setting should be a dot notation matching the defaults 
 * settings structure.  For instance, to set the JSON-RPC provider, you would 
 * set the setting with this key: 'defaults.jsonRPC.current' to the value of the
 * HTTP endpoint.
 *
 * Example
 * =======
 *    await setUserSetting(
 *      '0xdeadbeef...',
 *      'defaults.jsonRPC.current',
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
  const settingResults = await getUserSettings(address);
  if (!settingResults.success) throw new Error(settingResults.error);

  // Overlay the DB results onto our defaults
  settingResults.data.map(s => {
    if (_.get(settings, s.name) !== 'undefined') {
      let val = s.value;
      if (typeof _.get(settings, s.name) === 'boolean') {
        // Bools in SQLite are 1/0, so do a little coaxing
        if (
          (typeof s.value === 'string' && s.value === '1')
          || (typeof s.value !== 'string' && s.value)
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
