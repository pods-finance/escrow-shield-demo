require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path:__dirname+'/.env'});

const { BESU_RPC_URL, LOCAL_RPC_URL, SEPOLIA_RPC_URL, BC_DEFAULT_PRIVATE_KEY, BANKA_PRIVATE_KEY, BANKB_PRIVATE_KEY, BANKC_PRIVATE_KEY, BANKD_PRIVATE_KEY, DEV_MNEMONIC, POLYGON_RPC_URL } = process.env;

require('./tasks/index');
module.exports = {
  defaultNetwork: "besu",
  networks: {
    hardhat: {
    },
    polygon: {
      url: POLYGON_RPC_URL,
      accounts: {
        mnemonic: DEV_MNEMONIC,
        initialIndex: 0,
        count: 1
      },
      timeout: 20000000
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [BC_DEFAULT_PRIVATE_KEY, BANKA_PRIVATE_KEY, BANKB_PRIVATE_KEY, BANKC_PRIVATE_KEY, BANKD_PRIVATE_KEY],
      timeout: 20000000
    },
    localhost: {
      url: LOCAL_RPC_URL,
      accounts: [BC_DEFAULT_PRIVATE_KEY, BANKA_PRIVATE_KEY, BANKB_PRIVATE_KEY, BANKC_PRIVATE_KEY, BANKD_PRIVATE_KEY],
      timeout: 20000000
    },
    besu: {
      url: BESU_RPC_URL,
      accounts: [BC_DEFAULT_PRIVATE_KEY, BANKA_PRIVATE_KEY, BANKB_PRIVATE_KEY, BANKC_PRIVATE_KEY, BANKD_PRIVATE_KEY],
      chainId: 25581337,
      timeout: 20000000
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_APIKEY,
      polygon: process.env.POLYGONSCAN_APIKEY
    },
  },
  sourcify: {
    enabled: false,
    customChains: [ {
      network: "besu",
      chainId: 25581337,
    }]
  },
  mocha: {
    timeout: 40000
  }
}