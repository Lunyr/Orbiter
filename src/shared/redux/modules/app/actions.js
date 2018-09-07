import createTriggerAlias from '../../helpers/createTriggerAlias';
import { Web3API } from '../../../../backend/api';

const actions = {
  CONNECT_WEB3: 'app/CONNECT_WEB3',
};

export const connectToBlockchain = createTriggerAlias(actions.CONNECT_WEB3, () => ({
  type: actions.CONNECT_WEB3,
  payload: Web3API.connect().then((network) => {
    return Web3API.initializeContracts(network);
  }),
}));

export default actions;
