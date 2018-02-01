const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)

const should = require('should')
const expect = require('expect')


contract('DevContract', function(accounts) {
  let contract;

  beforeEach(async function() {
    contract = await GentoDaoDeployer()
  });

  // setCurrentTime() + currentTime()
  it("should be possible to mock the time in the test contract", async function() {
    // the time of the mock contract is set to 0 in the beginning for convenience reasons
    expect(+await contract.currentTime.call()).toBe(0)
    // forward the time to 1 s in future
    await contract.setCurrentTime.sendTransaction(1000)
    expect(+await contract.currentTime.call()).toBe(1000)

    // it should also be possible to go back in time!
    await contract.setCurrentTime.sendTransaction(0)
    expect(+await contract.currentTime.call()).toBe(0)
  })

  // setCurrentTime() + currentTime()
  it("should not be possible to mock the time in a contract without the dev flag", async function() {
    // deploy a new contract with dev flag set false
    contract = await GentoDaoDeployer({dev: false})

    try {
      // forward the time to 1 s in future
      await contract.setCurrentTime.sendTransaction(1000)
      should.fail("this transaction should have raised an error")
    } catch (e) {
      expect(e.message).toContain("VM Exception while processing transaction: ")
    }

    // currentTime should be more or less the current system time (now in a smart contract returns the block time)
    expect(+await contract.currentTime.call()).toBeCloseTo(new Date().getTime()/1000, -1)
  })

});
