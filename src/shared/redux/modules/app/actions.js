import { testAPI } from '../../../../main/backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  FETCH_TEST_DATA: 'app/FETCH_TEST_DATA',
};

export const fetchTestData = createTriggerAlias(actions.FETCH_TEST_DATA, () => ({
  type: actions.FETCH_TEST_DATA,
  payload: testAPI.readAll(),
}));

export default actions;
