require('dotenv').config();
import { HardhatUserConfig } from 'hardhat/config';
require('hardhat-abi-exporter');
import '@nomicfoundation/hardhat-toolbox';

const INFURA_API_KEY = process.env.INFURA_API_KEY ? process.env.INFURA_API_KEY : '';
const PRIVATE_KEY = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : '';
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY ? process.env.ETHERSCAN_KEY : '';
const BSCSCAN_KEY = process.env.BSCSCAN_KEY ? process.env.BSCSCAN_KEY : '';

const config: any = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ethereum: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    bsc: {
      url: `https://rpc.ankr.com/bsc`,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
        mainnet: ETHERSCAN_KEY,
        bsc: BSCSCAN_KEY ,
    }
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 2,
    pretty: true,
  },
};

export default config;
