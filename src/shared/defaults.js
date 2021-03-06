import path from 'path';

const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
};

const jsonRPC = {
  mainnet: 'https://jsonrpc.lunyr.com/',
  ropsten: 'https://ropsten.infura.io/kHjl2LF2ra5jYPjrWdqB',
  lunyr_testnet: 'https://testrpc.lunyr.com/',
  current: null,
};

jsonRPC.current = isDevelopment() ? jsonRPC.lunyr_testnet : jsonRPC.mainnet;

const router = {
  addresses: {
    1: '0x98857edD3543D0b7000eCBcc804c82108D08fd30',
    23332: '0x865d206cf5758541c0c49e8e76619eebdc30268c',
  },
  abi: [
    {
      constant: true,
      inputs: [{ name: '_name', type: 'string' }],
      name: 'getTargetCount',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_name', type: 'string' }],
      name: 'get',
      outputs: [{ name: '', type: 'address' }, { name: '', type: 'bytes32' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_name', type: 'string' },
        { name: '_setter', type: 'address' },
        { name: 'val', type: 'bool' },
      ],
      name: 'setSetter',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_newAdmin', type: 'address' }],
      name: 'setAdmin',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_name', type: 'string' }, { name: '_payload', type: 'bytes32' }],
      name: 'setAsset',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_name', type: 'string' }, { name: 'idx', type: 'uint256' }],
      name: 'getIdx',
      outputs: [{ name: '', type: 'address' }, { name: '', type: 'bytes32' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_name', type: 'string' },
        { name: '_addr', type: 'address' },
        { name: '_abiHash', type: 'bytes32' },
      ],
      name: 'set',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_nextContract', type: 'address' }],
      name: 'setNext',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_name', type: 'string' }],
      name: 'getAsset',
      outputs: [{ name: '', type: 'bytes32' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_name', type: 'string' }],
      name: 'reset',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'nextContract',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'admin',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: '_admin', type: 'address' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    { payable: false, stateMutability: 'nonpayable', type: 'fallback' },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'name', type: 'string' },
        { indexed: false, name: 'addr', type: 'address' },
        { indexed: false, name: 'abiHash', type: 'bytes32' },
      ],
      name: 'NamethSet',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'name', type: 'string' },
        { indexed: false, name: 'abiHash', type: 'bytes32' },
      ],
      name: 'NamethSetAsset',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'name', type: 'string' }],
      name: 'NamethReset',
      type: 'event',
    },
  ],
};

const privacy = {
  errorReporting: true,
  analytics: true,
};

const ipfs = {
  host: 'ipfs.infura.io',
  port: 5001,
};

const getConfigDir = () => {
  let configPath;
  if (typeof process.env.APPDATA !== 'undefined') {
    configPath = process.env.APPDATA;
  } else if (process.platform === 'darwin') {
    configPath = path.join(process.env.HOME, 'Library', 'Application Support');
  } else {
    configPath = path.join(process.env.HOME, '.config');
  }
  return path.join(configPath, 'lunyr-orbiter');
};

const getAPIRoot = () => {
  if (typeof process.env.API_ROOT !== 'undefined') {
    return process.env.API_ROOT;
  } else if (isDevelopment()) {
    return 'https://testapi.lunyr.com/';
  }
  return 'https://api.lunyr.com/';
};

const getLogLevel = () => {
  if (typeof process.env.LOG_LEVEL !== 'undefined') {
    return parseInt(process.env.LOG_LEVEL);
  } else if (isDevelopment()) {
    return 20;
  } else {
    return 30;
  }
};

export default {
  isDevelopment: isDevelopment(),
  privacy,
  logging: {
    logLevel: getLogLevel(),
  },
  ipfs,
  jsonRPC,
  router,
  sentry: {
    endpoint: 'https://f5d930b0c90a412ebc6b19ca30aa4ea2@sentry.io/1280675',
  },
  eventLogConfig: {
    attempts: 5,
  },
  sweeper: {
    maxTransactionAge: 10 * 60 * 1000, // 10 minutes
  },
  configDir: getConfigDir(),
  lunyrAPIRoot: getAPIRoot(),
};
