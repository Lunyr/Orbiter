import { testAPI } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  REGISTER: 'auth/REGISTER',
};

export const register = createTriggerAlias(actions.REGISTER, params => ({
  type: actions.REGISTER,
  payload: testAPI.readAll(),
}));


export default actions;
