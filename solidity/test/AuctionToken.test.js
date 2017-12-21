const AuctionToken = artifacts.require("./AuctionToken.sol");
const should = require('should')
const expect = require('expect')

//Currently we only have a single AuctionToken with mocked time which is deployed in migrations.
async function getTestToken() {
  const testContract = await AuctionToken.deployed()
  //set time back to 0
  await testContract.setCurrentTime.sendTransaction(0)
  return testContract
}

contract('AuctionToken', function(accounts) {

  it("should be possible to mock the time in the test contract", async function() {
    const testContract = await getTestToken()
    //The time of the mock contract is set to 0 in the beginning for convenience reasons
    expect(+await testContract.currentTime.call()).toBe(0) //truffle returns strings for numbers
    await testContract.setCurrentTime.sendTransaction(1000)
    expect(+await testContract.currentTime.call()).toBe(1000) //truffle returns strings for numbers

    //It should also be possible to go back in time!
    await testContract.setCurrentTime.sendTransaction(0)
    expect(+await testContract.currentTime.call()).toBe(0) //truffle returns strings for numbers
  })

  it("should not be possible to compute a buyPrice when the ICO is not running", async function() {
    const testContract = await getTestToken()

    await testContract.setCurrentTime.sendTransaction(1000000-1)
    await expect(testContract.getBuyPrice.call()).rejects.toEqual(expect.any(Error)) // see: https://github.com/facebook/jest/issues/3601
    await testContract.setCurrentTime.sendTransaction(2000000)
    await expect(testContract.getBuyPrice.call()).rejects.toEqual(expect.any(Error))
  })

  it("should return a linearly increasing price during the ICO with getBuyPrice()", async function() {
    const testContract = await getTestToken()
    await testContract.setCurrentTime.sendTransaction(1000000)
    const startPrize = 10
    const endPrize = 100
    const startTime = 1000000
    const endTime = 2000000

    for (let i=startTime; i<endTime; i+= (endTime-startTime) / 20) {
      await testContract.setCurrentTime.sendTransaction(i)
      let currentPrice = Math.floor(startPrize + (endPrize - startPrize) * (i- startTime) / (endTime - startTime))
      expect(+await testContract.getBuyPrice.call()).toBeCloseTo(currentPrice, 5)
    }
  })

  it("should be possible to buy something during the ICO", async function() {
    const testContract = await getTestToken()
    await testContract.setCurrentTime.sendTransaction(1200000)
    await testContract.getBuyPrice.call()
    await testContract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')});
  })

  it("should not be possible to buy something outside the ICO", async function() {
    const testContract = await getTestToken()
    try {
      await testContract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})
      should.fail("this transaction should have raised an error")
    }
    catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should calculate the right bought amount with buy()", async function() {
    const testContract = await getTestToken()
    await testContract.setCurrentTime.sendTransaction(1200000)
    const boughtAmount = await testContract.buy.call({from: accounts[1], value: 10000})
    const buyPrice = await testContract.getBuyPrice.call()
    const expectedAmount = 10000 / buyPrice.toNumber()
    expect(boughtAmount.toNumber()).toBeCloseTo(expectedAmount, 0);
  })

  it("should not be possible to buy something with amount < buyPrice", async function() {
    const testContract = await getTestToken()
    await testContract.setCurrentTime.sendTransaction(1200000)
    let buyPrice = await testContract.getBuyPrice.call()
    const smallerBuyPrice = --buyPrice;
    try {
      await testContract.buy.sendTransaction({from: accounts[1], value: smallerBuyPrice})
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should not be possible to buy more tokens than there are in the ICO", async function() {
    const testContract = await getTestToken()
    await testContract.setCurrentTime.sendTransaction(1200000)
    const currTokens = await testContract.balanceOf(accounts[0])
    const buyPrice = await testContract.getBuyPrice.call()
    let buyValue = currTokens * buyPrice
    const actBuyValue = buyValue += buyPrice
    try {
      await testContract.buy.sendTransaction({from: accounts[2], value: actBuyValue})
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

});
