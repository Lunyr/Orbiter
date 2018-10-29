import { Web3API } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  AD_INFORMATION: 'advertising/AD_INFORMATION',
  FETCH: 'advertising/GET_ADS',
  APPEND_ADS: 'advertising/APPEND_ADS',
};

/**
 * Fetches the ads in lunyr
 */
export const fetchAds = createTriggerAlias(actions.FETCH, () => ({
  type: actions.FETCH,
  payload: Web3API.fetchAds(),
}));

export default actions;
