export const IPFS_ADDRESS =
  process.env.NODE_ENV === 'production'
    ? '/dns4/testnet.lunyr.com/tcp/443/wss/ipfs/QmStzWTPdhLP9XeMdgdbEAsAeHwqn6PpxkN682RQ9gi3gQ'
    : '/dns4/testnet.lunyr.com/tcp/443/wss/ipfs/QmStzWTPdhLP9XeMdgdbEAsAeHwqn6PpxkN682RQ9gi3gQ';

export default {
  init: true, // default
  start: true,
  IPFS_URL: 'https://ipfs.io/ipfs/',
  EXPERIMENTAL: {
    // enable experimental features
    pubsub: false,
    sharding: false, // enable dir sharding
    dht: false, // enable KadDHT, currently not interopable with go-ipfs
  },
  config: {
    // overload the default IPFS node config
    Addresses: {
      Swarm: [],
    },
    Discovery: {
      MDNS: {
        Enabled: false,
        Interval: 10,
      },
      webRTCStar: {
        Enabled: false,
      },
    },
    Bootstrap: [
      IPFS_ADDRESS,
      '/ip4/147.135.130.181/tcp/4001/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic', // ipfs.io
      '/ip4/217.182.195.23/tcp/4001/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6', // ipfs.io
    ],
  },
  libp2p: {
    // add custom modules to the libp2p stack of your node
    modules: {},
  },
};
