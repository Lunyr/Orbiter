import _ from 'lodash';
import { default as settings } from './defaults';
import { getUserSettings } from '../backend/api';

/**
 * User settings(other than defaults) are stored in sqlite in a key/value type
 * structure.
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
