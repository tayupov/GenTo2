# GenTo2

GenTo is a platform that facilitates Initial Coins Offerings. It creates user-defined Smart Contracts and automatically deploys them to the blockchain – without the need to write a single line of code!

Hiding technical details from the user, we make Initial Coin Offerings accessible for a broader, non-technical audience. GenTo provides an intuitive web-based UI that guides the user through the contract creation process step by step.

GenTo has been developed by a student group at the chair for Information Systems Engineering at Technical University of Berlin in collaboration with venture capitalist and startup advisor Globumbus.

## Getting Started

1. Install node dependencies
```bash
npm i
```
2. Start testrpc in another terminal window. Testrpc is your local development blockchain, **you need to start it whenever you run gento locally**.
```bash
testrpc -m "<your words>"
```
3. Build contract bytecode. This has to be done once and afterwards whenever testrpc changed
```bash
npm run build:contracts
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
#in another terminal:
testrpc
npm run test:truffle
```
### Coverage
**Note:** The coverage tool is in early development, expect hickups and don't trust it too much.

To generate coverage reports, run
```bash
npm run test:coverage
```
After the tests ran through, you can find the reports in *GenTo2/coverage/index.html*.

You do **not** need to start testrpc, as it runs it's own testrpc.

If you receive a PORT in use error (`Error: listen EADDRINUSE :::8555`), TestRPC might not have been properly shut down in a previous run. The following command kills the previous testrpc version:
```bash
fuser -k -n tcp 8555
```
