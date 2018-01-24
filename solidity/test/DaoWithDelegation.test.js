const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)


const should = require('should');
const expect = require('expect');


let newProposalEventListener;

async function getProposalID() {
  let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  // check whether the proposal gets created
  assert.equal(newProposalLog.length, 1, 'should be one new Proposal');
  // returns the proposal log object with proposal id
  return newProposalLog[0].args.proposalID;
}

contract('DaoWithDelegation', function(accounts) {
    let contract;
    beforeEach(async function() {
    // Every auction token is a Proposal token
    contract = await GentoDaoDeployer()
    newProposalEventListener = contract.NewProposalCreated();
  });

  /*it("shouldn't be possible for a shareholder to claim DMR if he doesn't get delegated VP", async function() {
      await contract.setCurrentTime.sendTransaction(1200000)
      await contract.buy.sendTransaction({from: accounts[1], value: 200})
      await contract.buy.sendTransaction({from: accounts[2], value: 200})
      await contract.buy.sendTransaction({from: accounts[3], value: 200})
      await contract.setCurrentTime.sendTransaction(2200000)
      await contract.newProposal.sendTransaction(accounts[1], 345, 0, {from: accounts[1]})
      let proposalID = await getProposalID()
  })*/

  /**
  METHODS
  */

  // delegate()
  it("should pass the Proposal when the tokenholder has delegated his vote", async function() {
    // Set time between ICO start and END
    await contract.setCurrentTime.sendTransaction(1200000)
    // user 1 and user 3 should become a shareholder
    await contract.buy.sendTransaction({from: accounts[1], value: 1000})
    await contract.buy.sendTransaction({from: accounts[3], value: 1000})
    await contract.setCurrentTime.sendTransaction(2200000)
    // first create a new Proposal before user can vote
    await contract.newProposal.sendTransaction(accounts[1], 20, 0, {from: accounts[1]})
    let proposalID = await getProposalID();
    // user 3 delegates his Proposal power in FoW 0 (Finance) to user 1
    // await contract.delegate.sendTransaction(0, accounts[1], {from: accounts[3]})
    // await contract.vote.sendTransaction(proposalID, false, {from: accounts[3]})
    // // user 1 has more Proposal power then user 3
    // await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    // // Set time to after the Proposal period
    // await contract.setCurrentTime.sendTransaction(2300000)
    // // executes the Proposal
    // await contract.executeProposal.sendTransaction(proposalID)
    //
    // const p = await contract.getProposal.call(proposalID);
    //
    // expect(contract.getInfluenceOfVoter.call(accounts[1], 0)).toBe(10)
    // expect(contract.getInfluenceOfVoter.call(accounts[3], 0)).toBe()
    // expect(p[4]).toBe(true)
    // expect(p[5]).toBe(true)
  })

  // delegate()
  it("delegation after ending a vote should not have an effect on the vote", async function() {
      // Set time between ICO start and END
      await contract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await contract.buy.sendTransaction({from: accounts[1], value: 4000})
      await contract.buy.sendTransaction({from: accounts[2], value: 3000})
      await contract.buy.sendTransaction({from: accounts[3], value: 2000})
      // Set time to after ICO
      await contract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 1 and User 3 Vote
      await contract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[3]})
      // Set time to after the Proposal period
      await contract.setCurrentTime.sendTransaction(2300000)
      // End Proposal
      await contract.executeProposal.sendTransaction(proposalID)
      // User 2 delegates power in Field of Work 2 to User 3
      await contract.delegate.sendTransaction(2, accounts[0], {from: accounts[2]})
      // Get Proposal details
      const p = await contract.getProposal.call(proposalID);
      // Proposal should pass with 33 %
      expect(Number(p[6])).toBe(33)
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
      // Set time between ICO start and END
      await contract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await contract.buy.sendTransaction({from: accounts[1], value: 4000})
      await contract.buy.sendTransaction({from: accounts[2], value: 3000})
      await contract.buy.sendTransaction({from: accounts[3], value: 2000})
      // Set time to after ICO
      await contract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 2 delegates power in Field of Work 0 to User 3
      await contract.delegate.sendTransaction(2, accounts[3], {from: accounts[2]})
      // User 1 and User 3 Vote
      await contract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[3]})
      // Set time to after the Proposal period
      await contract.setCurrentTime.sendTransaction(2300000)
      // End Proposal
      await contract.executeProposal.sendTransaction(proposalID)
      // getNumProposals()-1 because it accesses the Proposal in the Proposal array
      const p = await contract.getProposal.call(proposalID);
      // Proposal should pass with 55%
      expect(Number(p[6])).toBe(55)
      expect(p[4]).toBe(true)
      expect(p[5]).toBe(true)
  })

  // delegate()
  it("delegation in one field should not affect the others", async function() {
      // Set time between ICO start and END
      await contract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await contract.buy.sendTransaction({from: accounts[1], value: 4000})
      await contract.buy.sendTransaction({from: accounts[2], value: 3000})
      await contract.buy.sendTransaction({from: accounts[3], value: 2000})
      // Set time to after ICO
      await contract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 2 delegates power in all Field of Works except 2 to User 3
      await contract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
      await contract.delegate.sendTransaction(1, accounts[3], {from: accounts[2]})
      await contract.delegate.sendTransaction(3, accounts[3], {from: accounts[2]})
      // User 1 and User 3 Vote
      await contract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[3]})
      // Set time to after the Proposal period
      await contract.setCurrentTime.sendTransaction(2300000)
      // End Proposal
      await contract.executeProposal.sendTransaction(proposalID)
      // Get Proposal details
      const p = await contract.getProposal.call(proposalID);
      // Proposal should pass with 33 %
      expect(Number(p[6])).toBe(33)
      expect(p[4]).toBe(true)
      expect(p[5]).toBe(false)
  })

  // getInfluenceOfVoter()
  it("should compute the right influence of tokenholder", async function() {
    await contract.setCurrentTime.sendTransaction(1300000)

    // user 1, 5 and 6 become shareholder
    await contract.buy.sendTransaction({from: accounts[1], value: 10000})
    await contract.buy.sendTransaction({from: accounts[5], value: 10000})
    await contract.buy.sendTransaction({from: accounts[6], value: 10000})

    await contract.delegate.sendTransaction(1, accounts[1], {from: accounts[5]})
    await contract.delegate.sendTransaction(1, accounts[1], {from: accounts[6]})

    // only user 5 delegates to user 1 => result of getInfluenceOfVoter = 540
    expect(+await contract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(810)
  })

  // getInfluenceOfVoter()
  it("should compute the right influence after delegation", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // user 1,2,3,4 become shareholder evenly
    await contract.buy.sendTransaction({from: accounts[1], value: 1000})
    await contract.buy.sendTransaction({from: accounts[2], value: 1000})
    await contract.buy.sendTransaction({from: accounts[3], value: 1000})
    await contract.buy.sendTransaction({from: accounts[4], value: 1000})
    await contract.setCurrentTime.sendTransaction(2200000)
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
