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
      .then((account) => {
        console.log('account returned', account);
        return account;
      })
      .catch((err) => {
        console.error('got me an error getting stuff', err);
        return err;
      }),
  })
);

export default actions;
