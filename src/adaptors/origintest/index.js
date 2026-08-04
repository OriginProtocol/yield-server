const sdk = require('@defillama/sdk');
const utils = require('../utils');

const getApy = async () => {
  const pools = [
    {
      pool: 'origintest-pool-1',
      chain: utils.formatChain('ethereum'),
      project: 'origin-test',
      symbol: 'ETH',
      tvlUsd: 0,
      apy: 0,
    },
  ];
  return pools;
};

module.exports = {
  timetravel: false,
  apy: getApy,
  url: 'https://originprotocol.com',
};
