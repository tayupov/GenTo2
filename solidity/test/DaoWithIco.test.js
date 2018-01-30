const GentoDao = artifacts.require("./GentoDao.sol");
const DaoWithIco = artifacts.require("./DaoWithIco.sol")
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)

const should = require('should')
const expect = require('expect')

let newProposalEventListener;

async function getProposalID() {
  let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  // check whether the proposal gets created
  assert.equal(newProposalLog.length, 1, 'should be one new Proposal');
  // returns the proposal log object with proposal id
  return newProposalLog[0].args.proposalID;
}

contract('DaoWithICO', function(accounts) {
  let contract;

  beforeEach(async function() {
    contract = await GentoDaoDeployer()
    newProposalEventListener = contract.NewProposalCreated();
  });

  /**

  METHODS

  */

  // buy()
  it("tests that user become shareholer only if they buy some shares", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // user 7 isn't a shareholder because he didn't buy anything
    const isSharehoder1 = await contract.isShareholder.call(accounts[7]);
    // !! converts 0 to false
    expect(!!isSharehoder1).toBe(false);
    // user 2 becomes a shareholder
    await contract.buy.sendTransaction({from: accounts[2],value: 4000})

    const isSharehoder2 = await contract.isShareholder.call(accounts[2]);
    expect(!!isSharehoder2).toBe(true);
  })

  // buy() with to less balance
  it("should not be possible to buy something with amount < buyPrice", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // get the current buy price
    let buyPrice = await contract.getBuyPrice.call()
    // reduce the buy price by decrementing the old buy price
    const smallerBuyPrice = --buyPrice;
    try {
      // transaction fails because of to low balance of user 1
      await contract.buy.sendTransaction({from: accounts[1], value: smallerBuyPrice})
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  // buy() with buying a to high amount of token
  it("should not be possible to buy more tokens than there are in the ICO", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // get the current balance of the ICO
    const currTokensTemp = await contract.remainingTokensForICOPurchase()
    const currTokens = currTokensTemp.toNumber()
    // get the buy price
    const buyPrice = await contract.getBuyPrice.call()
    // multiply both values
    let buyValue = currTokens * buyPrice
    // create a too high value for failing the buy transcation of the ICO
    const actBuyValue = buyValue += buyPrice
    try {
      await contract.buy.sendTransaction({from: accounts[2], value: actBuyValue})
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  // buy() during ico
  it("should be possible to buy something during the ICO", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.getBuyPrice.call()
    // user 1 become a shareholder because he buyes token
    await contract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')});
  })

  // getBuyPrice() estimates buy price
  it("should calculate the right bought amount with buy()", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // returns the bought amount of user 1
    const boughtAmount = await contract.buy.call({from: accounts[1], value: 10000})
    const buyPrice = await contract.getBuyPrice.call()
    const expectedAmount = 10000 / buyPrice.toNumber()
    expect(boughtAmount.toNumber()).toBeCloseTo(expectedAmount, 0)
  })

  // getBuyPrice()
  it("should return different buy price of a shareholder with increasing time", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})
    expect(+await contract.getBuyPrice.call()).toBeCloseTo(28)
    await contract.setCurrentTime.sendTransaction(1000000)
    expect(+await contract.getBuyPrice.call()).toBeCloseTo(10)

  })

  // getBuyPrice()
  it("should return a linearly increasing price during the ICO with getBuyPrice()", async function() {
    // forward the time into future
    await contract.setCurrentTime.sendTransaction(1000000)
    // define a minimized ICO
    const startPrize = 10
    const endPrize = 100
    const startTime = 1000000
    const endTime = 2000000
    // checks that all computed current prices between start and end time are close to 5
    for (let i=startTime; i<endTime; i+= (endTime-startTime) / 20) {
      await contract.setCurrentTime.sendTransaction(i)
      // computes the current price between start time and end time
      let currentPrice = Math.floor(startPrize + (endPrize - startPrize) * (i- startTime) / (endTime - startTime))
      // the curent buy price should be close to 5 in every iteration
      expect(+await contract.getBuyPrice.call()).toBeCloseTo(currentPrice, 5)
    }
  })

  // isIcoFinished
  it("should check that the ICO is finished and the DAO is created", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})
    expect(await contract.isIcoFinished.call()).toBe(false)
    // set time after ICO
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 345, 0, {from: accounts[1]})
    let proposalID = await getProposalID();
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
    expect(await contract.isIcoFinished.call()).toBe(true)
    // set time after proposal period
    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalID)
    expect(await contract.isIcoFinished.call()).toBe(true)

  })

  /**

  MODIFIER

  */

  // icoRunning
  it("should not be possible to compute a buyPrice when the ICO is not running", async function() {
    // forward the time into future
    await contract.setCurrentTime.sendTransaction(1000000-1)
    // access to buy price should fail
    // for implementation details of method rejection see: https://github.com/facebook/jest/issues/3601
    await expect(contract.getBuyPrice.call()).rejects.toEqual(expect.any(Error))
    await contract.setCurrentTime.sendTransaction(2000000)
    await expect(contract.getBuyPrice.call()).rejects.toEqual(expect.any(Error))
  })

  // icoRunning
  it("should not be possible to buy something outside the ICO", async function() {
    try {
      // time isn't forwarded between ICO START and END and user 1 isn't a shareholder
      await contract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})
      should.fail("this transaction should have raised an error")
    }
    catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  // daoActive
  it("should be not possible to vote if the DAO isn't active", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 345, 0, {from: accounts[1]})
    let proposalID = await getProposalID();
    await contract.setCurrentTime.sendTransaction(0)
    try {
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
    } catch(e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

});
