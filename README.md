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
testrpc
```
3. Build contract bytecode. This has to be done once and afterwards whenever testrpc changed
```bash
npm run build:contracts
```
4. Start the app
```bash
npm start
```

## Testing contracts
```bash
#in another terminal:
testrpc
npm run test:contracts
```