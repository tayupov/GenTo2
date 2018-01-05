const AuctionToken = artifacts.require("./AuctionToken.sol");
const AuctionTokenDeployer = require("./util/AuctionTokenDeployer.js")(AuctionToken)

const should = require('should')
const expect = require('expect')

contract('AuctionToken', function(accounts) {
  let contract;
  beforeEach(async function() {
    contract = await AuctionTokenDeployer()
  });

  it("should be possible to mock the time in the test contract", async function() {
    //The time of the mock contract is set to 0 in the beginning for convenience reasons
    expect(+await contract.currentTime.call()).toBe(0) //truffle returns strings for numbers
    await contract.setCurrentTime.sendTransaction(1000)
    expect(+await contract.currentTime.call()).toBe(1000) //truffle returns strings for numbers

    //It should also be possible to go back in time!
    await contract.setCurrentTime.sendTransaction(0)
    expect(+await contract.currentTime.call()).toBe(0) //truffle returns strings for numbers
  })

  it("should not be possible to mock the time in a contract without the dev flag", async function() {
    //deploy a new contract with dev flag set false
    contract = await AuctionTokenDeployer({dev: false})

    try {
      await contract.setCurrentTime.sendTransaction(1000)
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }

    //currentTime should be more or less the current system time (now in a smart contract returns the block time)
    expect(+await contract.currentTime.call()).toBeCloseTo(new Date().getTime()/1000, -1)
  })

  it("should not be possible to compute a buyPrice when the ICO is not running", async function() {

    await contract.setCurrentTime.sendTransaction(1000000-1)
    await expect(contract.getBuyPrice.call()).rejects.toEqual(expect.any(Error)) // see: https://github.com/facebook/jest/issues/3601
    await contract.setCurrentTime.sendTransaction(2000000)
    await expect(contract.getBuyPrice.call()).rejects.toEqual(expect.any(Error))
  })

  it("should return a linearly increasing price during the ICO with getBuyPrice()", async function() {
    await contract.setCurrentTime.sendTransaction(1000000)
    const startPrize = 10
    const endPrize = 100
    const startTime = 1000000
    const endTime = 2000000

    for (let i=startTime; i<endTime; i+= (endTime-startTime) / 20) {
      await contract.setCurrentTime.sendTransaction(i)
      let currentPrice = Math.floor(startPrize + (endPrize - startPrize) * (i- startTime) / (endTime - startTime))
      expect(+await contract.getBuyPrice.call()).toBeCloseTo(currentPrice, 5)
    }
  })

  it("should be possible to buy something during the ICO", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.getBuyPrice.call()
    await contract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')});
  })

  it("should not be possible to buy something outside the ICO", async function() {
    try {
      await contract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})
      should.fail("this transaction should have raised an error")
    }
    catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should calculate the right bought amount with buy()", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    const boughtAmount = await contract.buy.call({from: accounts[1], value: 10000})
    const buyPrice = await contract.getBuyPrice.call()
    const expectedAmount = 10000 / buyPrice.toNumber()
    expect(boughtAmount.toNumber()).toBeCloseTo(expectedAmount, 0);
  })

  it("should not be possible to buy something with amount < buyPrice", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    let buyPrice = await contract.getBuyPrice.call()
    const smallerBuyPrice = --buyPrice;
    try {
      await contract.buy.sendTransaction({from: accounts[1], value: smallerBuyPrice})
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should not be possible to buy more tokens than there are in the ICO", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    const currTokensTemp = await contract.bal()
    const currTokens = currTokensTemp.toNumber()
    const buyPrice = await contract.getBuyPrice.call()
    let buyValue = currTokens * buyPrice
    const actBuyValue = buyValue += buyPrice
    try {
      await contract.buy.sendTransaction({from: accounts[2], value: actBuyValue})
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

});
