import createTriggerAlias from '../../helpers/createTriggerAlias';
import { Web3API } from '../../../../backend/api';

const actions = {
  CONNECT_WEB3: 'app/CONNECT_WEB3',
  INIT_CONTRACTS: 'app/INIT_CONTRACTS',
};

export const connectToBlockchain = createTriggerAlias(actions.CONNECT_WEB3, () => ({
  type: actions.CONNECT_WEB3,
  payload: Web3API.connect(),
}));

export const initializeContracts = createTriggerAlias(actions.INIT_CONTRACTS, network => ({
  type: actions.INIT_CONTRACTS,
  payload: Web3API.initializeContracts(network),
}));

export default actions;
