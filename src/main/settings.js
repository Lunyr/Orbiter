import db from './backend/db';

// TODO: Load user config and maybe some helper functions to set settings

const jsonRPC = {
    mainnet: 'https://mainnet.infura.io/kHjl2LF2ra5jYPjrWdqB',
    ropsten: 'https://ropsten.infura.io/kHjl2LF2ra5jYPjrWdqB',
    lunyr_testnet: 'https://testrpc.lunyr.com/',
    current: null,
};
jsonRPC.current = process.env.NODE_ENV === 'development' ? jsonRPC.lunyr_testnet : jsonRPC.mainnet;

export default {
  isDevelopment: process.env.NODE_ENV === 'development',
  privacy: {
    errorReporting: true,
  },
  ipfs: {
    //APIRoot: 'https://ipfs.infura.io:5001',
    host: 'ipfs.infura.io',
    port: 5001,
  },
  jsonRPC,
  router: {
    addresses: {
        1: '0x98857edD3543D0b7000eCBcc804c82108D08fd30',
        23332: '0x865d206cf5758541c0c49e8e76619eebdc30268c',
    },
    abi: [{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTargetCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"get","outputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_setter","type":"address"},{"name":"val","type":"bool"}],"name":"setSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newAdmin","type":"address"}],"name":"setAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"},{"name":"idx","type":"uint256"}],"name":"getIdx","outputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_addr","type":"address"},{"name":"_abiHash","type":"bytes32"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_nextContract","type":"address"}],"name":"setNext","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"reset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nextContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"abiHash","type":"bytes32"}],"name":"NamethSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"}],"name":"NamethReset","type":"event"}]
  },
}