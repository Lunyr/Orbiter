import { Web3API } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  CONNECT: 'web3/CONNECT',
};

export const connectToBlockchain = createTriggerAlias(actions.CONNECT, () => {
  console.log('running connection meow', 'gettings params up in here', Web3API);
  return {
    type: actions.CONNECT,
    payload: Web3API.connect('https://testrpc.lunyr.com/'),
  };
});

export default actions;
