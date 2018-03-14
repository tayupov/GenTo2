# GenTo2

GenTo is a platform that facilitates creating Decentralized Autonomous Organizations (DAOs). It creates user-defined Smart Contracts and automatically deploys them to the blockchain. The platform allows running an Initial Coin Offering for a DAO and implements basic governance mechanisms, that enable token holders to decide over the usage of the organizsation's funds. The application assets are deployed to the InterPlanetary File System. All of this without the need to write a single line of code!

With the governance mechanisms we make investing in Initial Coin Offerings safer for investors.
Hiding technical details from the user, we make creating Decentralized Autonomous Organizations accessible for a broader, non-technical audience. GenTo provides an intuitive web-based UI that guides the user through the contract creation process step by step.

GenTo has been developed by a student group at the chair for Information Systems Engineering at Technical University of Berlin in collaboration with venture capitalist and startup advisor Globumbus.

## Prerequisites
Before running GenTo locally you have to get the following software

* Node.js (v9.4.0 tested)
* Ganache CLI (v6.1.0 tested)
* MetaMask (v4.2.0 tested)
* Truffle (v3.4.11 tested)

## Getting Started

1. Install node dependencies
```bash
npm i
```
2. Start ganache in another terminal window. Ganache is your local development blockchain, **you need to start it whenever you run gento locally**.
```bash
ganache-cli -m "<your words>"
```
3. Build contract bytecode. This has to be done once and afterwards whenever ganache changed. This also deploys some  mockd ata to the blockchain, you can alter the mock data in the file solidity/migrationsToyData/daos.yml
```bash
npm run rebuild:contracts
```
4. Start the app
```bash
npm start
```
If you get this following error: Module not found: Can't resolve 'app' in '.../GenTo2/src', try
```bash
export default NODE_PATH=src
npm start
```

## Testing contracts
If you want to just run the test, execute
```bash
ganache-cli
#in another terminal:
npm run test:truffle
```
### Coverage
**Note:** The coverage tool is in early development, expect hickups and don't trust it too much.

To generate coverage reports, run
```bash
npm run test:coverage
```
After the tests ran through, you can find the reports in *GenTo2/coverage/index.html*.

You do **not** need to start testrpc/ganache, as it runs it's own testrpc.

If you receive a PORT in use error (`Error: listen EADDRINUSE :::8555`), TestRPC might not have been properly shut down in a previous run. The following command kills the previous testrpc version:
```bash
fuser -k -n tcp 8555
```
