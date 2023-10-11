### ArdCoin Token
---
# Project Overview

---

## Technical Requirement
 - Smart Contracts are written with Solidity language.
 - Smart Contracts mostly uses OpenZeppelin Contracts.
 - Smart Contracts follow the Natspec Format.
 - Smart Contracts must be written with full flexibility.
 - Solidity compiler version 0.8.19 is used.
 - Using the Hardhat development framework.
 - Typescript is used for testing & deployment scripts.
 - Using the hardhat-abi-exporter plugin for ABI export when smart contracts compiled.
 - Smart contracts are designed to be deployed to Ethereum chain.

---

## Deployment flow
 1. Copy .env-example file and rename it to .env
 1. Set owner account PRIVATE KEY on env file
 1. Run the deployment script

---

## Functionality Requirement

### Roles
 - Pauser : Can pause transfer features
 - Snapshoter : Can use the snapshot features
 - Minter : Can use mint features of the smart contract
 - Admin : Can update blacklist and access roles such as PAUSER/MINTER/SNAPSHOT

### Features
 - Transfer tokens
 - Minter Role can mint tokens
 - Snapshot Role can snapshot balance
 - Pauser Role can pause transfer functionality of the token
 - Admin can update roles
 - Admin can update blacklist
 - Anyone can burn their OWN tokens

### Use Case
 - Standard ERC-20 Token use-cases

---

## Getting Started
---
Recommended Node version is 16.0.0 and above.

### Available commands
```

# install dependencies
$ npm install

# run tests
$ npm run test

# compile contracts & generate ABI and Typescript types
$ npm run compile

# check test coverage
$ npm run coverage

# force compile contracts & generate ABI and Typescript types
$ npm run force-compile

# deploy contracts locally
$ npm run deploy-local

# deploy contracts to ganache
$ npm run deploy-ganache

# deploy contracts to bsc
$ npm run deploy

# deploy contracts to testnet bsc
$ npm run deploy-test

```

## Project Structure
---
This a template hardhat typescript project composed of contracts, tests, and deploy instructions that provides a great starting point for developers to quickly get up and running and deploying smart contracts on the Ethereum blockchain.

### Tests
---
Tests are found in the ./test/ folder.

### Contracts
---
Solidity smart contracts are found in ./contracts/

### Coverage
---
Coverages are generated after running the "npm run coverage" command

### ABI
---
Solidity smart contracts ABI's are generated in ./abi/ when contracts are compiled.

### Deploy
---
Deploy script can be found in the ./scripts/deployment.ts.

Rename ./.env.example to ./.env in the project root. To add the private key of a deployer account, assign the environment variables.

```
# deploy contracts locally
$ npm run deploy-local

# deploy contracts to ganache
$ npm run deploy-ganache

# deploy contracts to bsc
$ npm run deploy

# deploy contracts to testnet bsc
$ npm run deploy-test
```

---
