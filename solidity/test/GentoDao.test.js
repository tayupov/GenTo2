const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)

const should = require('should')
const expect = require('expect')

var newProposalEventListener;

async function getProposalID() {
  let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  // check whether the proposal gets created
  assert.equal(newProposalLog.length, 1, 'should be one new Proposal');
  // returns the proposal log object with proposal id
  return newProposalLog[0].args.proposalID;
}

contract('GentoDao', function(accounts) {
  let contract;

  beforeEach(async function() {
    contract = await GentoDaoDeployer()
    newProposalEventListener = contract.NewProposalCreated();
  });
  //truffle returns strings for numbers
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

  it("should be possible to claim the payout after the proposal period is over", async function() {
    // set time between ICO START and END
    await contract.setCurrentTime.sendTransaction(1200000)
    // user 0,1,2 become shareholders
    await contract.buy.sendTransaction({from: accounts[0], value: 100})
    await contract.buy.sendTransaction({from: accounts[1], value: 200})
    await contract.buy.sendTransaction({from: accounts[2], value: 300})
    // set time to after ICO
    await contract.setCurrentTime.sendTransaction(2200000)
    // create a new proposal in field of work 0
    await contract.newProposal.sendTransaction(accounts[1], 345, 0, {from: accounts[1]})

    let proposalID = await getProposalID();
    // user 0,1,2 vote for the proposal
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
    // set time to after the proposal period
    await contract.setCurrentTime.sendTransaction(2300000)
    // execute the proposal therefor the proposal gets passed and finished
    await contract.executeProposal.sendTransaction(proposalID)
    // get the proposal by id
    var p = await contract.getProposal.call(proposalID)
    // claim payout is only possible if the proposal is finished and passed
    expect(p[4]).toBe(true)
    expect(p[5]).toBe(true)
    // get the proposal payout by id
    await contract.claimPayout.sendTransaction(proposalID, {from: accounts[1]})
    // the proposal payout should be the same as the param value while creating the proposal
    // user 1 is the creator of the proposal and he gets the payout
    // truffle returns strings for numbers
    expect(Number(p[1])).toBe(345)
  })

  it("should ensure that the claimer of the payout can get the payout only once", async function() {
    // set time between ICO START and END
    await contract.setCurrentTime.sendTransaction(1200000)
    // user 5,6 become shareholders
    await contract.buy.sendTransaction({from: accounts[5], value: 100})
    await contract.buy.sendTransaction({from: accounts[6], value: 200})
    // set time to after ICO
    await contract.setCurrentTime.sendTransaction(2200000)
    // create a new proposal in field of work 0
    await contract.newProposal.sendTransaction(accounts[5], 345, 0, {from: accounts[5]})

    let proposalID = await getProposalID();
    // user 0,1,2 vote for the proposal
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[5]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[6]})
    // set time to after the proposal period
    await contract.setCurrentTime.sendTransaction(2300000)
    // execute the proposal therefor the proposal gets passed and finished
    await contract.executeProposal.sendTransaction(proposalID)
    // get the proposal by id
    var p = await contract.getProposal.call(proposalID)
    // user 1 claims the payout for the first time
    await contract.claimPayout.sendTransaction(proposalID, {from: accounts[5]})
    //if user 5 claims the payout again it should be rejected
    try {
      await contract.claimPayout.sendTransaction(proposalID, {from: accounts[5]})
      await contract.claimPayout.sendTransaction(proposalID, {from: accounts[5]})
      await contract.claimPayout.sendTransaction(proposalID, {from: accounts[5]})
      should.fail("it's not possible to claim the payout more then once")
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should ensure that the shareholder can claim the dividend only once", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newProposalDividend.sendTransaction(accounts[1], 0, 100, {from: accounts[1]})

    let proposalDividendID = await getProposalID();

    await contract.vote.sendTransaction(proposalDividendID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalDividendID, true, {from: accounts[2]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalDividendID)

    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[1]})
    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[2]})
    // user 1 tries to claim again but it should fail
    try {
      await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[1]})
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should ensure that the decision maker reward can be claimed only once", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})

    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDMRProposal.sendTransaction(accounts[1], 2, 100, {from: accounts[1]})
    let proposalVRTID = await getProposalID();

    await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[2]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalVRTID)

    await contract.claimDMR.sendTransaction(proposalVRTID, {from: accounts[1]})
    try {
      await contract.claimDMR.sendTransaction(proposalVRTID, {from: accounts[1]})
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }


  })

  it("should be able for different users to claim the dividend for a succesful proposal", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})
    // set time to after ICO
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newProposal.sendTransaction(accounts[1], 500, 0, {from: accounts[1]})

    let proposalID = await getProposalID()

    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
    // set time to after the proposal period
    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalID)
    var p1 = await contract.getProposal.call(proposalID)
    // proposals is passed and finished
    expect(p1[4]).toBe(true)
    expect(p1[5]).toBe(true)
    // create dividend proposal
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newProposalDividend.sendTransaction(accounts[1], 0, 100, {from: accounts[1]})

    let proposalDividendID = await getProposalID()

    await contract.vote.sendTransaction(proposalDividendID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalDividendID, true, {from: accounts[2]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalDividendID)
    var p2 = await contract.getProposal.call(proposalDividendID)

    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[1]})
    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[2]})

    expect(Number(p2[7])).toBe(100)
  })

  it("should allow for a decision maker to claim the voting reward token", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})

    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDMRProposal.sendTransaction(accounts[1], 2, 100, {from: accounts[1]})

    let proposalVRTID = await getProposalID()

    await contract.delegate.sendTransaction(2, accounts[1], {from: accounts[2]})

    await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalVRTID, false, {from: accounts[2]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalVRTID)
    var p = await contract.getProposal.call(proposalVRTID)

    await contract.claimDMR.sendTransaction(proposalVRTID, {from: accounts[1]})
    await contract.claimDMR.sendTransaction(proposalVRTID, {from: accounts[2]})
    expect(Number(await contract.getVRTInFoWOfDM.call(accounts[1], 2))).toBe(10)
    expect(Number(await contract.getVRTInFoWOfDM.call(accounts[2], 2))).toBe(0)
    expect(Number(p[8])).toBe(100)
  })

it("shouldn't be possible for a shareholder to claim DMR if he doesn't get delegated VP", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 200})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})

    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDMRProposal.sendTransaction(accounts[1], 0, 100, {from: accounts[1]})
    let proposalVRTID = await getProposalID()
    await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[2]})
    await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[1]})
    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalVRTID)
    await contract.claimDMR.sendTransaction(proposalVRTID, {from: accounts[1]})

    expect(Number(await contract.getVRTInFoWOfDM.call(accounts[1], 0))).toBe(14)
    // user 2 doesn't get a DMR because he doesn't vote on the proposal and didn't get VP from delegation
    expect(Number(await contract.getVRTInFoWOfDM.call(accounts[2], 0))).toBe(0)
    expect(Number(await contract.getVRTinFoW.call(0))).toBe(14)
})

});
