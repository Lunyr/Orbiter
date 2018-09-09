import createTriggerAlias from '../../helpers/createTriggerAlias';
import { Web3API } from '../../../../backend/api';

const actions = {
  FETCH_ACCOUNT_INFORMATION: 'app/FETCH_ACCOUNT_INFORMATION',
};

export const fetchAccountInformation = createTriggerAlias(
  actions.FETCH_ACCOUNT_INFORMATION,
  (address) => ({
    type: actions.FETCH_ACCOUNT_INFORMATION,
    payload: Web3API.fetchAccountInformation(address)
  })
);

export default actions;
