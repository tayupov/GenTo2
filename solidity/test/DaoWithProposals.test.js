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

contract('DaoWithProposals', function(accounts) {
    let contract;
    beforeEach(async function() {
    // Every auction token is a Proposal token
    contract = await GentoDaoDeployer()
    newProposalEventListener = contract.NewProposalCreated();
  });

  /**
  METHODS
  */

  // getNumProposals()
  it("should display the right number of initial Proposals", async function() {
    expect(+await contract.getNumProposals.call()).toEqual(0)
  })

  // getNumProposals()
  it("should display correct number of Proposals", async function() {
    await contract.setCurrentTime.sendTransaction(1300000)
    const numberOfInitialProposals = 0;
    // user 1 become a shareholder
    await contract.buy.sendTransaction({from: accounts[1], value: 10000})
    await contract.setCurrentTime.sendTransaction(2300000)
    // create 3 new Proposals
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 1, {from: accounts[1]})
    expect(+await contract.getNumProposals.call()).toBe(1 + numberOfInitialProposals)

    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 200, 2, {from: accounts[1]})
    expect(+await contract.getNumProposals.call()).toBe(2 + numberOfInitialProposals)

    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 300, 2, {from: accounts[1]})
    expect(+await contract.getNumProposals.call()).toBe(3)
  })

  // getNumProposals()
  it("should count the correct number of proposals", async function() {
    await contract.setCurrentTime.sendTransaction(1600000)

    await contract.buy.sendTransaction({from: accounts[4], value: 10000})
    await contract.buy.sendTransaction({from: accounts[5], value: 10000})
    await contract.buy.sendTransaction({from: accounts[7], value: 10000})

    await contract.setCurrentTime.sendTransaction(2600000)

    // should be 0
    const numberOfInitialProposals = await contract.getNumProposals.call()

    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[5], 10, 0, {from: accounts[5]})
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[4], 20, 0, {from: accounts[4]})
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[7], 3, 0, {from: accounts[7]})

    expect(+await contract.getNumProposals.call()).toBe(3 + Number(numberOfInitialProposals))
  })

  // vote()
  it("should execute Proposals with 2/3 confirmed votes", async function() {
      await contract.setCurrentTime.sendTransaction(1200000)

      // user 1,2,3 become shareholder
      await contract.buy.sendTransaction({from: accounts[1], value: 1000})
      await contract.buy.sendTransaction({from: accounts[2], value: 1000})
      await contract.buy.sendTransaction({from: accounts[3], value: 1000})

      await contract.setCurrentTime.sendTransaction(2200000)

      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})

      let proposalID = await getProposalID();

      await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
      await contract.vote.sendTransaction(proposalID, false, {from: accounts[3]})

      await contract.setCurrentTime.sendTransaction(2300000)
      await contract.executeProposal.sendTransaction(proposalID)
      const p = await contract.getProposal.call(proposalID)
      expect(p[5]).toBe(true)
      expect(p[6]).toBe(true)
  })

  // vote()
  it("should reject proposal with 1/3 confirmed votes", async function() {
      await contract.setCurrentTime.sendTransaction(1200000)

      // user 1,2,3 become a shareholder
      await contract.buy.sendTransaction({from: accounts[1], value: 1000})
      await contract.buy.sendTransaction({from: accounts[2], value: 1000})
      await contract.buy.sendTransaction({from: accounts[3], value: 1000})
      await contract.setCurrentTime.sendTransaction(2200000)

      // create a new Proposal
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();

      await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
      await contract.vote.sendTransaction(proposalID, false, {from: accounts[2]})
      await contract.vote.sendTransaction(proposalID, false, {from: accounts[3]})

      await contract.setCurrentTime.sendTransaction(2300000)
      await contract.executeProposal.sendTransaction(proposalID)
      const p = await contract.getProposal.call(proposalID);
      // Proposal is executed
      expect(p[5]).toBe(true)
      // Proposal isn't passed
      expect(p[6]).toBe(false)
  })

  // vote()
  it("users that are not shareholders should not be able to vote", async function() {
      // Set time between ICO start and END
      await contract.setCurrentTime.sendTransaction(1200000)
      // Let three users buy token
      await contract.buy.sendTransaction({from: accounts[1], value: 4000})
      // Set time to after ICO
      await contract.setCurrentTime.sendTransaction(2200000)
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = await getProposalID();
      // User 1 and User 3 Vote
      await contract.vote.sendTransaction(0, false, {from: accounts[1]})
      await expect(contract.vote.sendTransaction(0, false, {from: accounts[2]})).rejects.toEqual(expect.any(Error))
      await expect(contract.vote.sendTransaction(0, true, {from: accounts[3]})).rejects.toEqual(expect.any(Error))
  })

  // vote()
  it("should reject proposals with 1/3 confirmed votes", async function() {
    // Set time between ICO start and END
    await contract.setCurrentTime.sendTransaction(1300000)
    // user 0,1,2 become shareholder
    await contract.buy.sendTransaction({from:accounts[0], value: 10000})
    await contract.buy.sendTransaction({from:accounts[1], value: 10000})
    await contract.buy.sendTransaction({from:accounts[2], value: 10000})
    await contract.setCurrentTime.sendTransaction(2300000)
    // create a new Proposal
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 0, {from: accounts[1]})
    let proposalID = await getProposalID();
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    await contract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalID, false, {from: accounts[2]})
    // Set time to after the Proposal period
    await contract.setCurrentTime.sendTransaction(2400000)
    // execute the Proposal -> passed time is required
    await contract.executeProposal.sendTransaction(proposalID)
    // get the proposal
    const p = await contract.getProposal.call(proposalID);
    // proposal is finished
    expect(p[5]).toBe(true)
    // proposal isn't passed
    expect(p[6]).toBe(false)
  })

  // vote()
  it("should approve the proposal with 3/5 confirmed votes", async function() {
    // Set time between ICO start and END
    await contract.setCurrentTime.sendTransaction(1400000)
    // user 0,1,2,3,4 become shareholder
    await contract.buy.sendTransaction({from: accounts[0], value: 10000})
    await contract.buy.sendTransaction({from: accounts[1], value: 10000})
    await contract.buy.sendTransaction({from: accounts[2], value: 10000})
    await contract.buy.sendTransaction({from: accounts[3], value: 10000})
    await contract.buy.sendTransaction({from: accounts[4], value: 10000})
    await contract.setCurrentTime.sendTransaction(2400000)
    // create a new Proposal
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[0], 100, 0, {from: accounts[0]})
    let proposalID = await getProposalID();
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[2]})
    await contract.vote.sendTransaction(proposalID, false, {from: accounts[3]})
    await contract.vote.sendTransaction(proposalID, false, {from: accounts[4]})
    // Set time to after the Proposal period
    await contract.setCurrentTime.sendTransaction(2500000)
    // execute the Proposals
    await contract.executeProposal.sendTransaction(proposalID)
    // get the proposal
    const p = await contract.getProposal.call(proposalID);
    // proposal is finished
    expect(p[5]).toBe(true)
    // proposal is passed
    expect(p[6]).toBe(true)
  })

  // vote()
  it("should allow to vote for a tokenholder", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)

    await contract.buy.sendTransaction({from: accounts[0], value: 10000})
    await contract.buy.sendTransaction({from: accounts[1], value: 10000})
    await contract.buy.sendTransaction({from: accounts[2], value: 10000})
    await contract.setCurrentTime.sendTransaction(2200000)

    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[2], 10, 0, {from: accounts[2]})
    let proposalID = await getProposalID()

    await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    await contract.vote.sendTransaction(proposalID, false, {from: accounts[2]})
    await contract.setCurrentTime.sendTransaction(2300000)

    await contract.executeProposal.sendTransaction(proposalID)
    const p = await contract.getProposal.call(proposalID)

    expect(p[5]).toBe(true)
    expect(p[6]).toBe(true)
  })

  // executeProposal()
  it("checks whether the proposal gets finished after executing", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // user 1 become a shareholder
    await contract.buy.sendTransaction({from: accounts[1], value: 1000})
    await contract.setCurrentTime.sendTransaction(2200000)
    //create a new Proposal
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 103, 2, {from: accounts[1]})
    let proposalID = await getProposalID();
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})

    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.executeProposal.sendTransaction(proposalID)
    const p = await contract.getProposal.call(proposalID)
    // recipient of proposal is user 1
    expect(p[0]).toBe(accounts[1])
    // value of Proposal should be 103
    expect(Number(p[1])).toBe(103)
    // Proposal is finished
    expect(p[5]).toBe(true)
    // Proposal passed
    expect(p[6]).toBe(true)
  })

  // executeProposal()
  it("should check whether the inital proposal is not passed and not finished", async function() {
    await contract.setCurrentTime.sendTransaction(1300000)
    await contract.buy.sendTransaction({from: accounts[1], value: 100000})
    await contract.setCurrentTime.sendTransaction(2300000)
    // create new proposal in FoW = 0
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 29, 0, {from: accounts[1]})
    let proposalID = await getProposalID();

    await contract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
    const p = await contract.getProposal.call(proposalID)
    // Proposal not finished
    expect(p[5]).toBe(false)
    // Proposal not passed
    expect(p[6]).toBe(false)
    // number of Proposals = 1
    expect(+await contract.getNumProposals.call()).toBe(1)
  })

  // newProposal()
  it("should instantiate a new proposal", async function() {
    await contract.setCurrentTime.sendTransaction(1300000)

    await contract.buy.sendTransaction({from: accounts[0], value: 100000})
    await contract.setCurrentTime.sendTransaction(2300000)
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[0], 10, 0, {from: accounts[0]})
    let proposalID = await getProposalID();
    await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
    const p = await contract.getProposal.call(proposalID)
    expect(Number(p[1])).toBe(10)
  })

  // newProposal()
  it("should count the new created proposal", async function() {
    await contract.setCurrentTime.sendTransaction(1600000)
    var numberOfInitialProposals = 0;

    await contract.buy.sendTransaction({from: accounts[0], value: 10000})
        await contract.setCurrentTime.sendTransaction(2600000)
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[0], 100, 0, {from: accounts[0]})
    expect(numberOfInitialProposals + 1).toBe(+await contract.getNumProposals())
  })
  //
  // // newDividendProposal()
  // it("should be possible to create and to vote on a new dividend proposal", async function() {
  //   await contract.setCurrentTime.sendTransaction(1200000)
  //   await contract.buy.sendTransaction({from: accounts[0], value: 100000})
  //   await contract.buy.sendTransaction({from: accounts[1], value: 100000})
  //
  //   await contract.setCurrentTime.sendTransaction(2200000)
  //   await contract.newDividendProposal.sendTransaction("dividend", "dividend", 100, {from: accounts[0]})
  //
  //   let proposalID = await getProposalID()
  //   await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
  //   await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
  //
  //   await contract.setCurrentTime.sendTransaction(2300000)
  //   await contract.executeProposal.sendTransaction(proposalID)
  //   const p = await contract.getProposal.call(proposalID)
  //
  //   expect(Number(p[1])).toBe(0)
  //   expect(Number(p[4])).toBe(2200600)
  //   expect(p[5]).toBe(true)
  //   expect(p[6]).toBe(true)
  //   expect(Number(p[7])).toBe(100)
  //   expect(Number(p[8])).toBe(100)
  //   expect(Number(p[9])).toBe(0)
  // })
  //
  // // newDMRewardPropsal()
  // it("should be possible to create and to vote on a new decision maker reward proposal", async function() {
  //   await contract.setCurrentTime.sendTransaction(1200000)
  //   await contract.buy.sendTransaction({from: accounts[0], value: 100000})
  //   await contract.buy.sendTransaction({from: accounts[1], value: 100000})
  //
  //   await contract.setCurrentTime.sendTransaction(2200000)
  //   await contract.newDMRewardProposal.sendTransaction("proposal", "description", 100, {from: accounts[0]})
  //   let proposalID = await getProposalID();
  //   await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
  //   await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
  //
  //   await contract.setCurrentTime.sendTransaction(2300000)
  //   await contract.executeProposal.sendTransaction(proposalID)
  //   const p = await contract.getProposal.call(proposalID)
  //
  //   expect(Number(p[1])).toBe(0)
  //   expect(Number(p[4])).toBe(2200600)
  //   expect(p[5]).toBe(true)
  //   expect(p[6]).toBe(true)
  //   expect(Number(p[7])).toBe(100)
  //   expect(Number(p[8])).toBe(0)
  //   expect(Number(p[9])).toBe(100)
  // })

  /**
  MODIFIER
  */

  // votingAllowed
  it("should be not allowed to vote on the new proposal if the dao isn't created", async function() {
    // set the time between ico start and end
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[0], value: 100000})
    await contract.buy.sendTransaction({from: accounts[1], value: 100000})

    await contract.setCurrentTime.sendTransaction(2200000)
    await contract.newDMRewardProposal.sendTransaction("name", "description", 100, {from: accounts[0]})
    let proposalID = await getProposalID();
    // reset the time between ico start and end
    await contract.setCurrentTime.sendTransaction(1200000)
    try {
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[0]})
      await contract.vote.sendTransaction(proposalID, true, {from: accounts[1]})
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction")
    }
  })

  // onlyShareholders
  it("should be possible to create a new DMR proposal only if the user are shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(2200000)
    try {
      await contract.newDMRewardProposal.sendTransaction("name", "description", 100, {from: accounts[0]})
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction")
    }
  })

  // onlyShareholders
  it("should be possible to create a new proposal only if the user are shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(2200000)
    try {
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[0], 100, 1, {from: accounts[0]})
    } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction")
    }
  })
});
