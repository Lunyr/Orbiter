import Web3 from 'web3';
import {
  getList,
  unlock,
  newKey,
  save as saveKey,
  savePlain,
  dkToAddress,
  privToAddress,
} from '../../../../lib/accounts';
import { authenticate } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  REGISTER: 'auth/REGISTER',
  LOGIN: 'auth/LOGIN',
  LOGOUT: 'auth/LOGOUT',
  GET_ACCOUNTS: 'auth/GET_ACCOUNTS',
  IMPORT_FROM_API: 'auth/IMPORT_FROM_API',
};

export const getAccounts = createTriggerAlias(actions.GET_ACCOUNTS, () => ({
  type: actions.GET_ACCOUNTS,
  payload: getList().then((data) => {
    return {
      data,
    };
  }),
}));

export const register = createTriggerAlias(actions.REGISTER, ({ password }) => {
  // Generate a new privkey
  const dk = newKey();

  return {
    type: actions.REGISTER,
    payload: saveKey(password, dk).then((fileName) => {
      console.log('Saved new account key to ', fileName);
      return {
        address: dkToAddress(dk),
      };
    }),
  };
});

export const login = createTriggerAlias(actions.LOGIN, ({ address, password }) => ({
  type: actions.LOGIN,
  payload: unlock({ address, password }).then((privateKey) => {
    if (!privateKey) {
      return {
        loginError: new Error('Login failed!'),
      };
    }
    return {
      address: privToAddress(privateKey),
    };
  }),
}));

export const importAPIAccount = createTriggerAlias(
  actions.IMPORT_FROM_API,
  ({ email, password }) => ({
    type: actions.IMPORT_FROM_API,
    payload: authenticate(email, password).then(async (res) => {
      if (!res.success) throw new Error('Authentication failed: ' + res.error);
      const privKey = Web3.utils.sha3(`${password}.${res.username}`);
      await savePlain(password, privKey);
      const address = privToAddress(privKey);
      return address;
    }),
  })
);

export const logout = () => ({
  type: actions.LOGOUT,
});

export default actions;
