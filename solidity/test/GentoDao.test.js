const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)

const should = require('should')
const expect = require('expect')


contract('GentoDao', function(accounts) {
  let contract;

  beforeEach(async function() {
    contract = await GentoDaoDeployer()
  });

  async function listenForEvent(eventName) {
    // get the event listener for the specific event
    const listener = contract[eventName]();
    const log = await new Promise((resolve, reject) => listener.get(
        (error, log) => error ? reject(error) : resolve(log)));
    // check that there one new log object
    assert.equal(log.length, 1, 'should be one new event log object');
    // return only the properties which are important for testing
    return log[0].args;
  }

  /**
  METHODS
  */
/*
  // getTokenPrice()
  it("should return the token price after executing the dividend proposal", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 200})
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDividendProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
    let proposalID = (await listenForEvent('NewProposalCreated')).proposalID
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalID)
    let tokenPrice = (await listenForEvent('TokenPrice')).tokenPrice
    expect(+tokenPrice).toBe(28)
  })
  // claimPayout()
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
    await contract.newProposal.sendTransaction('Prop','Prop', accounts[1], 345, 0, {from: accounts[1]})
    let proposalID = (await listenForEvent('NewProposalCreated')).proposalID;
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
    expect(p[5]).toBe(true)
    expect(p[6]).toBe(true)
    // get the proposal payout by id
    await contract.claimPayout.sendTransaction(proposalID, {from: accounts[1]})
    // the proposal payout should be the same as the param value while creating the proposal
    // user 1 is the creator of the proposal and he gets the payout
    // truffle returns strings for numbers
    expect(Number(p[1])).toBe(345)
  })

  // claimPayout()
  it("should ensure that the claimer of the payout can get the payout only once", async function() {
    // set time between ICO START and END
    await contract.setCurrentTime.sendTransaction(1200000)
    // user 5,6 become shareholders
    await contract.buy.sendTransaction({from: accounts[5], value: 100})
    await contract.buy.sendTransaction({from: accounts[6], value: 200})
    // set time to after ICO
    await contract.setCurrentTime.sendTransaction(2200000)
    // create a new proposal in field of work 0
    await contract.newProposal.sendTransaction('Prop','Prop', accounts[5], 345, 0, {from: accounts[5]})
    let proposalID = (await listenForEvent('NewProposalCreated')).proposalID;
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
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  // claimDividend()
  it("should be able for different users to claim the dividend for a succesful proposal", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})
    // set time to after ICO
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 500, 0, {from: accounts[1]})
    let proposalID = (await listenForEvent('NewProposalCreated')).proposalID

    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
    // set time to after the proposal period
    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalID)
    var p1 = await contract.getProposal.call(proposalID)
    // proposals is passed and finished
    expect(p1[5]).toBe(true)
    expect(p1[6]).toBe(true)
    expect(+p1[8]).toBe(0)
    // create dividend proposal
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDividendProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
    let proposalDividendID = (await listenForEvent('NewProposalCreated')).proposalID

    await contract.vote.sendTransaction(proposalDividendID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalDividendID, true, {from: accounts[2]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalDividendID)
    var p2 = await contract.getProposal.call(proposalDividendID)

    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[1]})
    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[2]})

    expect(+p2[8]).toBe(100)
  })

  // claimDividend()
  it("should ensure that the shareholder can claim the dividend only once", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDividendProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
    let proposalDividendID = (await listenForEvent('NewProposalCreated')).proposalID;

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

  // claimDMR()
  it("should ensure that the decision maker reward can be claimed only once", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})

    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDMRewardProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
    let proposalDMRID = (await listenForEvent('NewProposalCreated')).proposalID;

    await contract.vote.sendTransaction(proposalDMRID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalDMRID, true, {from: accounts[2]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalDMRID)

    await contract.claimDecisionMakerReward.sendTransaction(proposalDMRID, {from: accounts[1]})
    try {
      await contract.claimDecisionMakerReward.sendTransaction(proposalDMRID, {from: accounts[1]})
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }


  })

  // claimDMR()
  it("should allow for a decision maker to claim the voting reward token", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})

    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDMRewardProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
    let proposalVRTID = (await listenForEvent('NewProposalCreated')).proposalID

    await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[2]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalVRTID)
    var p = await contract.getProposal.call(proposalVRTID)
    expect(p[5]).toBe(true)
    expect(p[6]).toBe(true)
    // if shareholder claim the DMR it's required that the decision maker reward of the shareholder is greater than 0
    expect(+await contract.decisionmakerRewards.call(accounts[1])).toBeGreaterThan(0)
    expect(+await contract.decisionmakerRewards.call(accounts[2])).toBeGreaterThan(0)

    await contract.claimDecisionMakerReward.sendTransaction(proposalVRTID, {from: accounts[1]})
    await contract.claimDecisionMakerReward.sendTransaction(proposalVRTID, {from: accounts[2]})
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[1], 0)).toBe(0)
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[2], 0)).toBe(0)
    // should be 1 because the sum of VRT after executing is 0 and then it's set to 1
    expect(+await contract.getVRTokenInFoW.call(0)).toBe(1)
    // get the amount of DMR during the proposal creation
    expect(+p[9]).toBe(100)
  })

// getVRTokenInFoWOfDecisionMaker() + getVRTokenInFoW()
it("compute the right amount of voting reward token if the proposal isn't passed", async function() {
  await contract.setCurrentTime.sendTransaction(1200000)
  await contract.buy.sendTransaction({from: accounts[1], value: 100})
  await contract.buy.sendTransaction({from: accounts[2], value: 200})

  await contract.setCurrentTime.sendTransaction(2200000)
  await contract.newDMRewardProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
  let proposalVRTID = (await listenForEvent('NewProposalCreated')).proposalID

  await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[1]})
  await contract.vote.sendTransaction(proposalVRTID, false, {from: accounts[2]})

  await contract.setCurrentTime.sendTransaction(2300000)
  await contract.executeProposal.sendTransaction(proposalVRTID)
  var p = await contract.getProposal.call(proposalVRTID)
  // proposal isn't passed thats why decision maker rewards of the shareholder isn't updated
  expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(0)
  expect(+await contract.decisionmakerRewards.call(accounts[2])).toBe(0)
  // not invoking claimDecisionMakerReward() doesn't reset the votingRewardTokens to 0 for testing
  expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[1], 0)).toBe(3)
  expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[2], 0)).toBe(7)
  // should be the sum of VRT of both shareholder in FoW 2
  expect(+await contract.getVRTokenInFoW.call(0)).toBe(10)
  // get the amount of DMR during the proposal creation
  expect(+p[9]).toBe(100)
})

// getVRTinFoW() + getVRTInFoWOfDM()
it("shouldn't be possible for a shareholder to claim DMR if he doesn't get delegated VP", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[1], value: 200})
    await contract.buy.sendTransaction({from: accounts[2], value: 200})

    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDMRewardProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
    let proposalVRTID = (await listenForEvent('NewProposalCreated')).proposalID
    await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[2]})
    await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[1]})
    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalVRTID)
    // after executing dmr proposal the vrt get resetted to 0
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[1], 0)).toBe(0)
    // user 2 doesn't get a DMR because he doesn't vote on the proposal and didn't get VP from delegation
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[2], 0)).toBe(0)
    expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(40)
    expect(+await contract.decisionmakerRewards.call(accounts[2])).toBe(0)
    // after claiming the dmr from user it gets resetted 0 too
    await contract.claimDecisionMakerReward.sendTransaction(proposalVRTID, {from: accounts[1]})
    expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(0)
})

// executeProposal()
it("should ensure that the voting reward tokens gets resetted by executing the proposal", async function() {
  await contract.setCurrentTime.sendTransaction(1200000)
  await contract.buy.sendTransaction({from: accounts[1], value: 200})
  await contract.buy.sendTransaction({from: accounts[2], value: 200})
  await contract.buy.sendTransaction({from: accounts[3], value: 200})

  await contract.setCurrentTime.sendTransaction(2200000)
  await contract.newDividendProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
  let proposalDivID = (await listenForEvent('NewProposalCreated')).proposalID
  await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[2]})
  await contract.delegate.sendTransaction(0, accounts[2], {from: accounts[3]})

  await contract.vote.sendTransaction(proposalDivID, true, {from: accounts[1]})
  await contract.vote.sendTransaction(proposalDivID, false, {from: accounts[2]})
  await contract.vote.sendTransaction(proposalDivID, true, {from: accounts[3]})

  await contract.setCurrentTime.sendTransaction(2300000)
  await contract.executeProposal.sendTransaction(proposalDivID)
  // if it's a dividend proposal the VRT don't get resetted to 0
  expect(+await contract.getVRTokenInFoW.call(0)).toBe(21)
  expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[1], 0)).toBe(14)
  expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[2], 0)).toBe(7)
  expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[3], 0)).toBe(0)

  expect(+await contract.dividends.call(accounts[1])).toBe(196)
  expect(+await contract.dividends.call(accounts[2])).toBe(196)
  expect(+await contract.dividends.call(accounts[3])).toBe(196)

})

// decisionmakerRewards
it("should ensure if a dividend proposal is created the decision maker reward is still 0", async function() {
  await contract.setCurrentTime.sendTransaction(1200000)
  await contract.buy.sendTransaction({from: accounts[1], value: 200})
  await contract.buy.sendTransaction({from: accounts[2], value: 200})
  await contract.setCurrentTime.sendTransaction(2200000)
  await contract.newDividendProposal.sendTransaction(accounts[1], 100, {from: accounts[1]})
  let proposalDivID = (await listenForEvent('NewProposalCreated')).proposalID
  await contract.vote.sendTransaction(proposalDivID, true, {from: accounts[1]})
  await contract.vote.sendTransaction(proposalDivID, false, {from: accounts[2]})
  await contract.setCurrentTime.sendTransaction(2300000)
  await contract.executeProposal.sendTransaction(proposalDivID)

  expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(0)
  expect(+await contract.decisionmakerRewards.call(accounts[2])).toBe(0)
  expect(+await contract.decisionmakerRewards.call(accounts[3])).toBe(0)
})

          */
});
