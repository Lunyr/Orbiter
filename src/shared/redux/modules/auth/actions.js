import { getUserSettings, setUserSetting } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  REGISTER: 'auth/REGISTER',
  LOGIN: 'auth/LOGIN',
  LOGOUT: 'auth/LOGOUT',
};

export const registered = createTriggerAlias(
  actions.REGISTER,
  ({ address, password, username }) => ({
    type: actions.REGISTER,
    payload: Promise.all([
      setUserSetting(address, 'address', address),
      setUserSetting(address, 'username', username),
      setUserSetting(address, 'password', password),
    ]).then(getUserSettings.bind(null, address)),
  })
);

export const login = createTriggerAlias(actions.LOGIN, ({ address }) => ({
  type: actions.LOGIN,
  payload: getUserSettings(address).then(({ success, data, error }) => {
    if (!success) {
      return new Error(error);
    }
    return {
      data,
      error,
    };
  }),
}));

export const logout = () => ({
  type: actions.LOGOUT,
});

export default actions;
