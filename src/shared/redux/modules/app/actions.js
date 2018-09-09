import createTriggerAlias from '../../helpers/createTriggerAlias';
import { Web3API } from '../../../../backend/api';

const actions = {
  CONNECT_WEB3: 'app/CONNECT_WEB3',
  UPDATE_QUEUE_STATUS: 'app/UPDATE_QUEUE_STATS',
  SET_QUEUE_SYNCING: 'app/SET_QUEUE_SYNCING',
};

export const connectToBlockchain = createTriggerAlias(actions.CONNECT_WEB3, () => ({
  type: actions.CONNECT_WEB3,
  payload: Web3API.connect().then(({ data: { network } }) => Web3API.initializeContracts(network)),
}));

export const updateQueueStatus = (status) => ({
  type: actions.UPDATE_QUEUE_STATUS,
  payload: status,
});

export const setQueueSyncing = (syncing, pollIntervalMS) => ({
  type: actions.SET_QUEUE_SYNCING,
  payload: { syncing, pollIntervalMS },
});

export default actions;
