const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)

const should = require('should')
const expect = require('expect')

contract('GentoDao', function(accounts) {
  let contract;
  let proposalHelper;

  beforeEach(async function() {
    contract = await GentoDaoDeployer()
    proposalHelper = await require("./util/ProposalHelper.js")(contract, accounts)
  });

  it("distributes a dividend evenly to all shareholders", async function () {
  const totalDividend = web3.toWei(0.8, "ether")
  const totalSpendInICO = web3.toWei(1, "ether")
  const userBalances = [0.3, 0.3, 0.25, 0.15]
  const buyPrice =1000
    contract = await GentoDaoDeployer({
      buyPriceStart: buyPrice,
      buyPriceEnd: buyPrice,
      totalSupply: web3.toWei(1, "ether")
    })
    const proposalID = 0
    await contract.setCurrentTime.sendTransaction(1000000)
    for (let i=0; i<userBalances.length; i++) {
      await contract.buy.sendTransaction({from: accounts[i], value: Math.floor(totalSpendInICO*userBalances[i])})
    }
    await contract.setCurrentTime.sendTransaction(2000000)
    await contract.newDividendProposal.sendTransaction("dividend", "dividend", totalDividend, {from: accounts[1]})

    for (let i=0; i<userBalances.length; i++){
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[i]})
    }
    await contract.setCurrentTime.sendTransaction(2100000)
    await contract.executeProposal.sendTransaction(proposalID)
    for (let i=0; i<userBalances.length; i++) {
      expect(+await contract.dividends.call(accounts[i])).toBeCloseTo(userBalances[i]*totalDividend, -1)
    }
  })

  // claimPayout()
  it("should be possible to claim the payout after the proposal period is over", async function() {
    await proposalHelper.simulateIco({0: 100, 1: 200, 2: 300})
    // create a new proposal in field of work 0
    await contract.newProposal.sendTransaction('Prop','Prop', accounts[1], 345, 0, {from: accounts[1]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true, 1: true, 2: true})
    // execute the proposal therefor the proposal gets passed and finished
    await contract.executeProposal.sendTransaction(proposalID)
    // get the proposal by id
    var p = await proposalHelper.getFormattedProposal(proposalID)
    // claim payout is only possible if the proposal is finished and passed
    expect(p.finished).toBe(true)
    expect(p.proposalPassed).toBe(true)
    // get the proposal payout by id
    await contract.claimPayout.sendTransaction(proposalID, {from: accounts[1]})
    // the proposal payout should be the same as the param value while creating the proposal
    // user 1 is the creator of the proposal and he gets the payout
    expect(+p.amount).toBe(345)
  })

  // claimPayout()
  it("should ensure that the claimer of the payout can get the payout only once", async function() {
    await proposalHelper.simulateIco({0: 100, 1: 200, 2: 300})
    await contract.newProposal.sendTransaction('Prop','Prop', accounts[1], 345, 0, {from: accounts[1]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true, 1: true, 2: true})
    await contract.executeProposal.sendTransaction(proposalID)
    var p = await proposalHelper.getFormattedProposal(proposalID)
    expect(p.finished).toBe(true)
    expect(p.proposalPassed).toBe(true)
    await contract.claimPayout.sendTransaction(proposalID, {from: accounts[1]})
    //if user 1 claims the payout again it should be rejected
    try {
      await contract.claimPayout.sendTransaction(proposalID, {from: accounts[1]})
      should.fail("this transaction should have raised an error")
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  // claimDividend()
  it("should be able for different users to claim the dividend for a succesful proposal", async function() {
    await proposalHelper.simulateIco({1: 100, 2: 200})
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 500, 0, {from: accounts[1]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {1: true, 2: true})
    await contract.executeProposal.sendTransaction(proposalID)
    var p1 = await proposalHelper.getFormattedProposal(proposalID)
    expect(p1.finished).toBe(true)
    expect(p1.proposalPassed).toBe(true)
    expect(+p1.dividend).toBe(0)
    // create dividend proposal
    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDividendProposal.sendTransaction('div', 'div desc', 100, {from: accounts[1]})
    let proposalDividendID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalDividendID, {1: true, 2: true})
    await contract.executeProposal.sendTransaction(proposalDividendID)
    var p2 = await proposalHelper.getFormattedProposal(proposalDividendID)

    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[1]})
    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[2]})

    expect(+p2.dividend).toBe(100)
  })

  // claimDividend()
  it("should ensure that the shareholder can claim the dividend only once", async function() {
    await proposalHelper.simulateIco({1: 100, 2: 200})
    await contract.newDividendProposal.sendTransaction('div', 'div desc', 100, {from: accounts[1]})
    let proposalDividendID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalDividendID, {1: true, 2: true})
    await contract.executeProposal.sendTransaction(proposalDividendID)
    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[1]})
    await contract.claimDividend.sendTransaction(proposalDividendID, {from: accounts[2]})
    // after claiming once the dividend should be 0 now instead of throwing an error
    expect(+await contract.dividends.call(accounts[1])).toBe(0)
    expect(+await contract.dividends.call(accounts[2])).toBe(0)
  })

  // claimDMR()
  it("should ensure that the decision maker reward can be claimed only once", async function() {
    await proposalHelper.simulateIco({1: 100, 2: 200})
    await contract.newDMRewardProposal.sendTransaction('dmr', 'dmr desc', 100, {from: accounts[1]})
    let proposalDMRID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[2]})
    await proposalHelper.voteBulk(proposalDMRID, {1: true, 2: true})
    await contract.executeProposal.sendTransaction(proposalDMRID)
    expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(25)
    expect(+await contract.decisionmakerRewards.call(accounts[2])).toBe(0)
    await contract.claimDecisionMakerReward.sendTransaction(proposalDMRID, {from: accounts[1]})
    // decision maker reward should be 0 after claiming once
    expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(0)
  })

  // claimDMR()
  it("should allow for a decision maker to claim the voting reward token", async function() {
    await proposalHelper.simulateIco({1: 100, 2: 200})
    await contract.newDMRewardProposal.sendTransaction('dmr', 'dmr desc', 100, {from: accounts[1]})
    let proposalVRTID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalVRTID, {1: true, 2: true})
    await contract.executeProposal.sendTransaction(proposalVRTID)
    var p = await proposalHelper.getFormattedProposal(proposalVRTID)
    expect(p.finished).toBe(true)
    expect(p.proposalPassed).toBe(true)
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
    expect(+p.dmr).toBe(100)
  })

  // getVRTokenInFoWOfDecisionMaker() + getVRTokenInFoW()
  it("compute the right amount of voting reward token if the proposal isn't passed", async function() {
    await proposalHelper.simulateIco({1: 100, 2: 200})
    await contract.newDMRewardProposal.sendTransaction('dmr', 'dmr desc', 100, {from: accounts[1]})
    let proposalVRTID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalVRTID, {1: true, 2: false})
    await contract.executeProposal.sendTransaction(proposalVRTID)
    var p = await proposalHelper.getFormattedProposal(proposalVRTID)
    // proposal isn't passed thats why decision maker rewards of the shareholder isn't updated
    expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(0)
    expect(+await contract.decisionmakerRewards.call(accounts[2])).toBe(0)
    // if distributeDMReward() isn't invoked then the votingRewardTokens aren't resetted to 0
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[1], 0)).toBe(6)
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[2], 0)).toBe(14)
    // should be the sum of VRT of both shareholder in FoW 2
    expect(+await contract.getVRTokenInFoW.call(0)).toBe(20)
    // get the amount of DMR during the proposal creation
    expect(+p.dmr).toBe(100)
  })

  // getVRTinFoW() + getVRTInFoWOfDM()
  it("shouldn't be possible for a shareholder to claim DMR if he doesn't get delegated VP", async function() {
      await proposalHelper.simulateIco({1: 200, 2: 200})
      await contract.newDMRewardProposal.sendTransaction('dmr', 'dmr desc', 100, {from: accounts[1]})
      let proposalVRTID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
      await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[2]})
      await contract.vote.sendTransaction(proposalVRTID, true, {from: accounts[1]})
      await contract.setCurrentTime.sendTransaction(2300000)
      await contract.executeProposal.sendTransaction(proposalVRTID)
      // after executing dmr proposal the vrt get resetted to 0
      expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[1], 0)).toBe(0)
      // user 2 doesn't get a DMR because he doesn't vote on the proposal and didn't get VP from delegation
      expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[2], 0)).toBe(0)
      expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(25)
      expect(+await contract.decisionmakerRewards.call(accounts[2])).toBe(0)
      // after claiming the dmr from user it gets resetted 0 too
      await contract.claimDecisionMakerReward.sendTransaction(proposalVRTID, {from: accounts[1]})
      expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(0)
  })

  // executeProposal()
  it("should ensure that the voting reward tokens won't resetted by executing a dividend proposal", async function() {
    await proposalHelper.simulateIco({1: 200, 2: 200, 3: 200})
    await contract.newDividendProposal.sendTransaction('div', 'div desc', 100, {from: accounts[1]})
    let proposalDivID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[2]})
    await contract.delegate.sendTransaction(0, accounts[2], {from: accounts[3]})
    await proposalHelper.voteBulk(proposalDivID, {1: true, 2: false, 3: true})
    await contract.executeProposal.sendTransaction(proposalDivID)
    // if it's a dividend proposal the VRT don't get resetted to 0
    expect(+await contract.getVRTokenInFoW.call(0)).toBe(42)
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[1], 0)).toBe(28)
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[2], 0)).toBe(14)
    expect(+await contract.getVRTokenInFoWOfDecisionMaker.call(accounts[3], 0)).toBe(0)
    expect(+await contract.dividends.call(accounts[1])).toBe(33)
    expect(+await contract.dividends.call(accounts[2])).toBe(33)
    expect(+await contract.dividends.call(accounts[3])).toBe(33)
  })

  // decisionmakerRewards
  it("should ensure if a dividend proposal is created the decision maker reward is still 0", async function() {
    await proposalHelper.simulateIco({1: 200, 2: 200})
    await contract.newDividendProposal.sendTransaction('div', 'div desc', 100, {from: accounts[1]})
    let proposalDivID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalDivID, {1: true, 2: true})
    await contract.executeProposal.sendTransaction(proposalDivID)
    expect(+await contract.dividends.call(accounts[1])).toBe(50)
    expect(+await contract.decisionmakerRewards.call(accounts[1])).toBe(0)
    expect(+await contract.decisionmakerRewards.call(accounts[2])).toBe(0)
    expect(+await contract.decisionmakerRewards.call(accounts[3])).toBe(0)
  })
});
