import Web3 from 'web3';
import { settings } from '../../shared/settings';
import { getLogger } from '../../lib/logger';

const log = getLogger('api-web3');

const connect = async () => {
  log.info('Connecting to web3 client', settings.jsonRPC);
  return new Web3.providers.HttpProvider(settings.jsonRPC.current);
};

export default {
  connect,
};
