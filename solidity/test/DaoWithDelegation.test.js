const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)
// const proposalHelper = require("./util/ProposalHelper.js")

const should = require('should');
const expect = require('expect');


contract('DaoWithDelegation', function(accounts) {
    let contract;
    let proposalHelper;

    beforeEach(async function() {
      contract = await GentoDaoDeployer();
      proposalHelper = await require("./util/ProposalHelper.js")(contract, accounts);
    });

  // delegate()
  it("should pass the Proposal when the tokenholder has delegated his vote", async function() {
    await proposalHelper.simulateIco({1: 1000, 3: 1000})
    // first create a new Proposal before user can vote
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 20, 0, {from: accounts[1]})
    // user 3 delegates his Proposal power in FoW 0 (Finance) to user 1
    await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[3]})
    await proposalHelper.voteBulk(0, {1: true, 3: false})
    // executes the Proposal
    await contract.executeProposal.sendTransaction(0)
    const p = await proposalHelper.getFormattedProposal(0)

    expect(+await contract.getInfluenceOfVoter.call(accounts[1], 0)).toBe(70)
    expect(+await contract.getInfluenceOfVoter.call(accounts[3], 0)).toBe(0)
    expect(p.finished).toBe(true)
    expect(p.proposalPassed).toBe(true)
  })

  // delegate()
  it("delegation after ending a vote should not have an effect on the vote", async function() {
      await proposalHelper.simulateIco({1: 4000, 2: 3000, 3:2000});
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})
      // user 1 and 3 vote
      await proposalHelper.voteBulk(0, {1: false, 3: true})
      await contract.executeProposal.sendTransaction(0)
      // during delegation both user should be sharehlder
      await contract.delegate.sendTransaction(2, accounts[1], {from: accounts[2]})
      // Get Proposal details
      const p = await proposalHelper.getFormattedProposal(0)
      // Proposal should pass with 33 %
      expect(+p.passedPercent).toBe(33)
  })

  // delegate()
  it("should fail the delegation if the token holder isn't a shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // account[9] is not a shareholder because he didn't buy anything
    try {
      // user 9 tries to delegate
      await contract.delegate.sendTransaction(0, accounts[9], {from: accounts[9]})
      should.fail("this transaction should have raised an error")
    } catch (e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  // delegate()
  it("should allow delegation to other users", async function() {
      await proposalHelper.simulateIco({1: 4000, 2: 3000, 3:2000})
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 0, {from: accounts[1]})
      // User 2 delegates power in Field of Work 0 to User 3
      await contract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
      await proposalHelper.voteBulk(0, {1: false, 3: true})
      await contract.executeProposal.sendTransaction(0)
      const p = await proposalHelper.getFormattedProposal(0)
      // Proposal should pass with 55%
      expect(+p.passedPercent).toBe(55)
      expect(p.finished).toBe(true)
      expect(p.proposalPassed).toBe(true)
  })

  // // delegate()
  it("delegation in one field should not affect the others", async function() {
      await proposalHelper.simulateIco({1: 4000, 2: 3000, 3:2000})
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
      // User 2 delegates power in all Field of Works except 2 to User 3
      await contract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
      await contract.delegate.sendTransaction(1, accounts[3], {from: accounts[2]})
      await contract.delegate.sendTransaction(3, accounts[3], {from: accounts[2]})
      // User 1 and User 3 Vote
      await proposalHelper.voteBulk(proposalID, {1: false, 3: true})
      await contract.executeProposal.sendTransaction(proposalID)
      // Get Proposal details
      const p = await proposalHelper.getFormattedProposal(proposalID)
      // Proposal should pass with 33 %
      expect(+p.passedPercent).toBe(33)
      expect(p.finished).toBe(true)
      expect(p.proposalPassed).toBe(false)
  })

  // getInfluenceOfVoter()
  it("should compute the right influence of tokenholder", async function() {
    await proposalHelper.simulateIco({1: 10000, 5: 10000, 6:10000})

    await contract.delegate.sendTransaction(1, accounts[1], {from: accounts[5]})
    await contract.delegate.sendTransaction(1, accounts[1], {from: accounts[6]})
    // only user 5 delegates to user 1 => result of getInfluenceOfVoter = 540
    expect(+await contract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(1071)
  })

  // getInfluenceOfVoter()
  it("should compute the right influence after delegation", async function() {
    await proposalHelper.simulateIco({1: 1000, 2: 1000, 3:1000, 4:1000})
    // Field of work 1 influence is distributed evenly
    expect(+await contract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(35)
    expect(+await contract.getInfluenceOfVoter.call(accounts[2], 1)).toBe(35)
    expect(+await contract.getInfluenceOfVoter.call(accounts[3], 1)).toBe(35)
    expect(+await contract.getInfluenceOfVoter.call(accounts[4], 1)).toBe(35)
    // Delegate influence from field of work from account 1 to 2
    await contract.delegate.sendTransaction(1, accounts[2], {from: accounts[1]})

    // Test field of work 1 incfluence
    expect(+await contract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(0)
    expect(+await contract.getInfluenceOfVoter.call(accounts[2], 1)).toBe(70)
    expect(+await contract.getInfluenceOfVoter.call(accounts[3], 1)).toBe(35)
    expect(+await contract.getInfluenceOfVoter.call(accounts[4], 1)).toBe(35)

    // Test other field of work (To see if it is untouched)
    expect(+await contract.getInfluenceOfVoter.call(accounts[1], 2)).toBe(35)
    expect(+await contract.getInfluenceOfVoter.call(accounts[2], 2)).toBe(35)
    expect(+await contract.getInfluenceOfVoter.call(accounts[3], 2)).toBe(35)
    expect(+await contract.getInfluenceOfVoter.call(accounts[4], 2)).toBe(35)
  })

});
