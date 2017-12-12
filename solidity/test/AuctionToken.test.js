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
  });
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
});
