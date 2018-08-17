import { TestAPI } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  FETCH_TEST_DATA: 'app/FETCH_TEST_DATA',
};

console.log('test api up in here', TestAPI);

export const fetchTestData = createTriggerAlias(actions.FETCH_TEST_DATA, () => ({
  type: actions.FETCH_TEST_DATA,
  payload: TestAPI.readAll(),
}));

export default actions;
