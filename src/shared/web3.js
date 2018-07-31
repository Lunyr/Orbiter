import Web3 from 'web3';
import settings from './settings';

export const web3 = new Web3(
  new Web3.providers.HttpProvider(settings.jsonRPC.current)
);