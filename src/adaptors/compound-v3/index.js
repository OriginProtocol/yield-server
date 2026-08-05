const axios = require("axios");
const sdk = require("@defillama/sdk");
const utils = require("../utils");

const markets = {
  ethereum: {
    USDC: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
    WETH: "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
    USDT: "0x3Afdc9BCA9213A35503b077a6072F3D0d5AB0840",
  },
  polygon: {
    USDC: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
    USDT: "0xaeB318360f27748Acb200CE616E389A6C9409a07",
  },
  arbitrum: {
    USDC: "0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA",
    USDT: "0xd98Be00b5D27fc98112BdE293e487f8D4cA57d07",
  },
  base: {
    USDC: "0xb125E6687d4313864e53df431d5425969c15Eb2F",
    WETH: "0x46e6b214b524310239732D51387075E0e70970bf",
  },
};

const getApy = async () => {
  const pools = [];
  for (const [chain, chainMarkets] of Object.entries(markets)) {
    for (const [symbol, address] of Object.entries(chainMarkets)) {
      try {
        const [supplyRate, borrowRate] = await Promise.all([
          sdk.api.abi.call({
            target: address,
            abi: "function getSupplyRate(uint) view returns (uint64)",
            params: [0],
            chain,
          }),
          sdk.api.abi.call({
            target: address,
            abi: "function getBorrowRate(uint) view returns (uint64)",
            params: [0],
            chain,
          }),
        ]);

        const supplyApy =
          ((Number(supplyRate.output) / 1e18) * 86400 * 365 - 1) * 100;
        const borrowApy =
          ((Number(borrowRate.output) / 1e18) * 86400 * 365 - 1) * 100;

        pools.push({
          pool: `${address}-${chain}`.toLowerCase(),
          chain: utils.formatChain(chain),
          project: "compound-v3",
          symbol,
          tvlUsd: 0,
          apyBase: supplyApy,
          apyBaseBorrow: borrowApy,
          underlyingTokens: [address],
          url: `https://app.compound.finance/markets/${symbol.toLowerCase()}-${chain}`,
        });
      } catch (e) {
        console.log(`Error fetching ${chain}/${symbol}: ${e.message}`);
      }
    }
  }
  return pools;
};

module.exports = {
  timetravel: false,
  apy: getApy,
};
