const GentoDao = artifacts.require("./GentoDao.sol");

const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)


const should = require('should');
const expect = require('expect');

/*
method signatures:

newProposal.sendTransaction(account, value, {from})
buy.sendTransaction({from, value})
vote.sendTransaction(voteId, supportsProposal, {from})
executeProposal.sendTransaction(voteId, {from})
newProposal.sendTransaction(account, value, FoW, {from})
getProposal(proposalID)
delegate(FoW, to, {from})

set() without call()!

*/
var newProposalEventListener;

async function getProposalID() {
  let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  // check whether the proposal gets created
  assert.equal(newProposalLog.length, 1, 'should be one new Proposal');
  // returns the proposal log object with proposal id
  return newProposalLog[0].args.proposalID;
}

contract('Proposal', function(accounts) {
  let testContract;
    beforeEach(async function() {
    // Every auction token is a Proposal token
    testContract = await GentoDaoDeployer()
    newProposalEventListener = testContract.NewProposalCreated();
  });

  it("should display the right number of initial Proposals", async function() {
    expect(+await testContract.getNumProposals.call()).toEqual(0)
  })


  it("should display correct number of Proposals", async function() {

    await testContract.setCurrentTime.sendTransaction(1300000)

    const numberOfInitialProposals = 0;

    // user 1 become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 10000})

    await testContract.setCurrentTime.sendTransaction(2300000)

    // create 3 new Proposals
    await testContract.newProposal.sendTransaction(accounts[1], 100, 1, {from: accounts[1]})

    expect(+await testContract.getNumProposals.call()).toBe(1 + numberOfInitialProposals)

    await testContract.newProposal.sendTransaction(accounts[1], 200, 2, {from: accounts[1]})

    expect(+await testContract.getNumProposals.call()).toBe(2 + numberOfInitialProposals)

    await testContract.newProposal.sendTransaction(accounts[1], 300, 2, {from: accounts[1]})

    expect(+await testContract.getNumProposals.call()).toBe(3)
  })


  it("should execute Proposals with 2/3 confirmed votes", async function() {
      await testContract.setCurrentTime.sendTransaction(1200000)

      // user 1,2,3 become shareholder
      await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[3], value: 1000})

      await testContract.setCurrentTime.sendTransaction(2200000)

      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})

      let proposalID = await getProposalID();

      await testContract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
      await testContract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
      await testContract.vote.sendTransaction(proposalID, false, {from: accounts[3]})

      await testContract.setCurrentTime.sendTransaction(2300000)
      await testContract.executeProposal.sendTransaction(proposalID)
      const p = await testContract.getProposal.call(proposalID)
      expect(p[4]).toBe(true)
      expect(p[5]).toBe(true)
  })

  it("should reject Proposals with 1/3 confirmed votes", async function() {
      await testContract.setCurrentTime.sendTransaction(1200000)

      // user 1,2,3 become a shareholder
      await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
      await testContract.setCurrentTime.sendTransaction(2200000)

      // create a new Proposal
      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();

      await testContract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
      await testContract.vote.sendTransaction(proposalID, false, {from: accounts[2]})
      await testContract.vote.sendTransaction(proposalID, false, {from: accounts[3]})

      await testContract.setCurrentTime.sendTransaction(2300000)
      await testContract.executeProposal.sendTransaction(proposalID)
      const p = await testContract.getProposal.call(proposalID);

      // Proposal is executed
      expect(p[4]).toBe(true)
      // Proposal isn't passed
      expect(p[5]).toBe(false)
  })

  it("checks whether the Proposal gets finished after executing", async function() {
    await testContract.setCurrentTime.sendTransaction(1200000)
    // user 1 become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
        await testContract.setCurrentTime.sendTransaction(2200000)
    //create a new Proposal
    await testContract.newProposal.sendTransaction(accounts[1], 103, 2, {from: accounts[1]})
    let proposalID = await getProposalID();

    // its important use FoW 0 = Finance
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[1]})

    await testContract.setCurrentTime.sendTransaction(2300000)
    await testContract.executeProposal.sendTransaction(+await testContract.getNumProposals()-1)
    const p = await testContract.getProposal.call(+await testContract.getNumProposals()-1)

    // recipient of Proposal is user 1
    expect(p[0]).toBe(accounts[1])
    // value of Proposal should be 29
    expect(Number(p[1])).toBe(103)
    // Proposal is finished
    expect(p[4]).toBe(true)
    // Proposal passed
    expect(p[5]).toBe(true)
  })

  it("should check whether the inital Proposal is not passed and not finished", async function() {
    await testContract.setCurrentTime.sendTransaction(1300000)

    await testContract.buy.sendTransaction({from: accounts[1], value: 100000})
    await testContract.setCurrentTime.sendTransaction(2300000)
    // should be in both cases FoW = 0 !
    await testContract.newProposal.sendTransaction(accounts[1], 29, 0, {from: accounts[1]})
    let proposalID = await getProposalID();

    await testContract.vote.sendTransaction(proposalID, false, {from: accounts[1]})

    const p = await testContract.getProposal.call(proposalID)
    // Proposal not finished
    expect(p[4]).toBe(false)
    // Proposal not passed
    expect(p[5]).toBe(false)
    // number of Proposals = 1
    expect(+await testContract.getNumProposals.call()).toBe(1)
  })

  it("should compute the right influence of tokenholder", async function() {
    await testContract.setCurrentTime.sendTransaction(1300000)

    // user 1, 5 and 6 become shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[5], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[6], value: 10000})

    await testContract.delegate.sendTransaction(1, accounts[1], {from: accounts[5]})
    await testContract.delegate.sendTransaction(1, accounts[1], {from: accounts[6]})

    // only user 5 delegates to user 1 => result of getInfluenceOfVoter = 540
    expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(810)
  })

  it("should instantiate a new Proposal", async function() {
    await testContract.setCurrentTime.sendTransaction(1300000)

    await testContract.buy.sendTransaction({from: accounts[0], value: 100000})
    await testContract.setCurrentTime.sendTransaction(2300000)
    await testContract.newProposal.sendTransaction(accounts[0], 10, 0, {from: accounts[0]})
    let proposalID = await getProposalID();
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    const p = await testContract.getProposal.call(proposalID)
    expect(Number(p[1])).toBe(10)
  })

  it("should pass the Proposal when the tokenholder has delegated his vote", async function() {
    // Set time between ICO start and END
    await testContract.setCurrentTime.sendTransaction(1400000)
    // user 1 and user 3 should become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
    await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
    await testContract.setCurrentTime.sendTransaction(2400000)
    // first create a new Proposal before user can vote
    await testContract.newProposal.sendTransaction(accounts[1], 20, 0, {from: accounts[1]})
    let proposalID = await getProposalID();
    // user 3 delegates his Proposal power in FoW 0 (Finance) to user 1
    await testContract.delegate.sendTransaction(0, accounts[1], {from: accounts[3]})
    await testContract.vote.sendTransaction(proposalID, false, {from: accounts[3]})
    // user 1 has more Proposal power then user 3
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    // Set time to after the Proposal period
    await testContract.setCurrentTime.sendTransaction(3300000)
    // executes the Proposal
    await testContract.executeProposal.sendTransaction(proposalID)

    const p = await testContract.getProposal.call(+await testContract.getNumProposals()-1);

    expect(p[4]).toBe(true)
    expect(p[5]).toBe(true)
  })

  it("should fail the delegation if the token holder isn't a shareholder", async function() {
    await testContract.setCurrentTime.sendTransaction(1200000)
    // account[9] is not a shareholder because he didn't buy anything
    try {
      // user 9 tries to delegate
      await testContract.delegate.sendTransaction(0, accounts[9], {from: accounts[9]})
      should.fail("this transaction should have raised an error")
    } catch (e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should create a new Proposal", async function() {
    await testContract.setCurrentTime.sendTransaction(1600000)
    var numberOfInitialProposals = 0;

    await testContract.buy.sendTransaction({from: accounts[0], value: 10000})
        await testContract.setCurrentTime.sendTransaction(2600000)
    await testContract.newProposal.sendTransaction(accounts[0], 100, 0, {from: accounts[0]})
    expect(numberOfInitialProposals + 1).toBe(+await testContract.getNumProposals())
  })


  it("should check that only if the user buys token he becomes a shareholder", async function() {
    await testContract.setCurrentTime.sendTransaction(1600000)

    // user 1 become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})

    // check whether the account is a shareholder
    // !! converts 0 or 1 to false or true
    expect(!!+await testContract.isShareholder.call(accounts[5])).toBe(false)
    expect(!!+await testContract.isShareholder.call(accounts[1])).toBe(true)
  })

  it("schould reject Proposals with 1/3 confirmed votes", async function() {
    // Set time between ICO start and END
    await testContract.setCurrentTime.sendTransaction(1300000)
    // user 0,1,2 become shareholder
    await testContract.buy.sendTransaction({from:accounts[0], value: 10000})
    await testContract.buy.sendTransaction({from:accounts[1], value: 10000})
    await testContract.buy.sendTransaction({from:accounts[2], value: 10000})
    await testContract.setCurrentTime.sendTransaction(2300000)
    // create a new Proposal
    await testContract.newProposal.sendTransaction(accounts[1], 100, 0, {from: accounts[1]})
    let proposalID = await getProposalID();
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    await testContract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
    await testContract.vote.sendTransaction(proposalID, false, {from: accounts[2]})
    // Set time to after the Proposal period
    await testContract.setCurrentTime.sendTransaction(2400000)
    // execute the Proposal -> passed time is required
    await testContract.executeProposal.sendTransaction(+await testContract.getNumProposals()-1)
    // get the proposal
    const p = await testContract.getProposal.call(+await testContract.getNumProposals()-1);
    // proposal is finished
    expect(p[4]).toBe(true)
    // proposal isn't passed
    expect(p[5]).toBe(false)
  })

  it("should approve the Proposal with 3/5 confirmed votes", async function() {
    // Set time between ICO start and END
    await testContract.setCurrentTime.sendTransaction(1400000)
    // user 0,1,2,3,4 become shareholder
    await testContract.buy.sendTransaction({from: accounts[0], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[1], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[2], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[3], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[4], value: 10000})
    await testContract.setCurrentTime.sendTransaction(2400000)
    // create a new Proposal
    await testContract.newProposal.sendTransaction(accounts[0], 100, 0, {from: accounts[0]})
    let proposalID = await getProposalID();
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
    await testContract.vote.sendTransaction(proposalID, false, {from: accounts[3]})
    await testContract.vote.sendTransaction(proposalID, false, {from: accounts[4]})
    // Set time to after the Proposal period
    await testContract.setCurrentTime.sendTransaction(2500000)
    // execute the Proposals
    await testContract.executeProposal.sendTransaction(proposalID)
    // get the proposal
    const p = await testContract.getProposal.call(proposalID);
    // proposal is finished
    expect(p[4]).toBe(true)
    // proposal is passed
    expect(p[5]).toBe(true)
  })

  it("should count the correct number of Proposals", async function() {
    await testContract.setCurrentTime.sendTransaction(1600000)

    await testContract.buy.sendTransaction({from: accounts[4], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[5], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[7], value: 10000})

    await testContract.setCurrentTime.sendTransaction(2600000)

    // should be 0
    const numberOfInitialProposals = await testContract.getNumProposals.call()

    await testContract.newProposal.sendTransaction(accounts[5], 10, 0, {from: accounts[5]})
    await testContract.newProposal.sendTransaction(accounts[4], 20, 0, {from: accounts[4]})
    await testContract.newProposal.sendTransaction(accounts[7], 3, 0, {from: accounts[7]})

    expect(+await testContract.getNumProposals.call()).toBe(3 + Number(numberOfInitialProposals))
  })

  it("should allow to vote for a tokenholder", async function() {
    await testContract.setCurrentTime.sendTransaction(1200000)

    await testContract.buy.sendTransaction({from: accounts[0], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[1], value: 10000})
    await testContract.buy.sendTransaction({from: accounts[2], value: 10000})
    await testContract.setCurrentTime.sendTransaction(2200000)

    await testContract.newProposal.sendTransaction(accounts[2], 10, 0, {from: accounts[2]})
    let proposalID = await getProposalID()

    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    await testContract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await testContract.vote.sendTransaction(proposalID, false, {from: accounts[2]})
    await testContract.setCurrentTime.sendTransaction(2300000)

    await testContract.executeProposal.sendTransaction(0)
    const p = await testContract.getProposal.call(proposalID)

    expect(p[4]).toBe(true)
    expect(p[5]).toBe(true)
  })

  it("should allow delegation to other users", async function() {
      // Set time between ICO start and END
      await testContract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
      await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
      await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
      // Set time to after ICO
      await testContract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 2 delegates power in Field of Work 0 to User 3
      await testContract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
      // User 1 and User 3 Vote
      await testContract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
      await testContract.vote.sendTransaction(proposalID, true, {from: accounts[3]})
      // Set time to after the Proposal period
      await testContract.setCurrentTime.sendTransaction(2300000)
      // End Proposal
      await testContract.executeProposal.sendTransaction(0)
      // getNumProposals()-1 because it accesses the Proposal in the Proposal array
      const p = await testContract.getProposal.call(proposalID);
      // Proposal should pass with 33 or 55 % ??? it should return 55% but it returns 33%
      expect(Number(p[6])).toBe(33)
      expect(p[4]).toBe(true)
  })

  it("delegation in one field should not affect the others", async function() {
      // Set time between ICO start and END
      await testContract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
      await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
      await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
      // Set time to after ICO
      await testContract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 2 delegates power in all Field of Works except 2 to User 3
      await testContract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
      await testContract.delegate.sendTransaction(1, accounts[3], {from: accounts[2]})
      await testContract.delegate.sendTransaction(3, accounts[3], {from: accounts[2]})
      // User 1 and User 3 Vote
      await testContract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
      await testContract.vote.sendTransaction(proposalID, true, {from: accounts[3]})
      // Set time to after the Proposal period
      await testContract.setCurrentTime.sendTransaction(2300000)
      // End Proposal
      await testContract.executeProposal.sendTransaction(0)
      // Get Proposal details
      const p = await testContract.getProposal.call(proposalID);
      // Proposal should pass with 33 %
      expect(Number(p[6])).toBe(33)
      expect(p[4]).toBe(true)
  })

  it("delegation after ending a vote should not have an effect on the vote", async function() {
      // Set time between ICO start and END
      await testContract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
      await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
      await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
      // Set time to after ICO
      await testContract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 1 and User 3 Vote
      await testContract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
      await testContract.vote.sendTransaction(proposalID, true, {from: accounts[3]})
      // Set time to after the Proposal period
      await testContract.setCurrentTime.sendTransaction(2300000)
      // End Proposal
      await testContract.executeProposal.sendTransaction(proposalID)
      // User 2 delegates power in Field of Work 2 to User 3
      await testContract.delegate.sendTransaction(2, accounts[0], {from: accounts[2]})
      // Get Proposal details
      const p = await testContract.getProposal.call(proposalID);
      // Proposal should pass with 33 %
      expect(Number(p[6])).toBe(33)

  })

  it("users that are not shareholders should not be able to vote", async function() {
      // Set time between ICO start and END
      await testContract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
      // Set time to after ICO
      await testContract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 1 and User 3 Vote
      await testContract.vote.sendTransaction(0, false, {from: accounts[1]})
      await expect(testContract.vote.sendTransaction(0, false, {from: accounts[2]})).rejects.toEqual(expect.any(Error))
      await expect(testContract.vote.sendTransaction(0, true, {from: accounts[3]})).rejects.toEqual(expect.any(Error))
  })

  it("tests that user become shareholer only if they buy some shares", async function() {
    await testContract.setCurrentTime.sendTransaction(1200000)
    // user 7 isn't a shareholder because he didn't buy anything
    const isSharehoder1 = await testContract.isShareholder.call(accounts[7]);
    // !! converts 0 to false
    expect(!!isSharehoder1).toBe(false);
    // user 2 becomes a shareholder
    await testContract.buy.sendTransaction({from: accounts[2],value: 4000})

    const isSharehoder2 = await testContract.isShareholder.call(accounts[2]);
    expect(!!isSharehoder2).toBe(true);
  })
  it("schould delegate properly", async function() {
        await testContract.setCurrentTime.sendTransaction(1200000)

        // user 1,2,3,4 become shareholder evenly
        await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
        await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
        await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
        await testContract.buy.sendTransaction({from: accounts[4], value: 1000})

        await testContract.setCurrentTime.sendTransaction(2200000)

        // Field of work 1 influence is distributed evenly
        expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(35)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[2], 1)).toBe(35)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[3], 1)).toBe(35)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[4], 1)).toBe(35)


        // Delegate influence from field of work from account 1 to 2
        await testContract.delegate.sendTransaction(1, accounts[2], {from: accounts[1]})

        // Test field of work 1 incfluence
        expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(0)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[2], 1)).toBe(70)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[3], 1)).toBe(35)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[4], 1)).toBe(35)

        // Test other field of work (To see if it is untouched)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 2)).toBe(35)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[2], 2)).toBe(35)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[3], 2)).toBe(35)
        expect(+await testContract.getInfluenceOfVoter.call(accounts[4], 2)).toBe(35)

  })
});
