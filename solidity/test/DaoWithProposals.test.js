const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)

const should = require('should');
const expect = require('expect');


contract('DaoWithProposals', function(accounts) {
    let contract;
    let proposalHelper;
    beforeEach(async function() {
      contract = await GentoDaoDeployer()
      proposalHelper = await require("./util/ProposalHelper.js")(contract, accounts)
  });

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
    await proposalHelper.simulateIco({4: 10000, 5: 10000, 7: 10000});
    // should be 0
    const numberOfInitialProposals = +await contract.getNumProposals.call()

    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[5], 10, 0, {from: accounts[5]})
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[4], 20, 0, {from: accounts[4]})
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[7], 3, 0, {from: accounts[7]})

    expect(+await contract.getNumProposals.call()).toBe(3 + numberOfInitialProposals)
  })

  // vote()
  it("should execute Proposals with 2/3 confirmed votes", async function() {
      await proposalHelper.simulateIco({1: 1000, 2: 1000, 3: 1000});
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
      await proposalHelper.voteBulk(proposalID, {1: true, 2: true, 3: false})
      await contract.executeProposal.sendTransaction(proposalID)
      const p = await proposalHelper.getFormattedProposal(proposalID)
      expect(p.finished).toBe(true)
      expect(p.proposalPassed).toBe(true)
  })

  // vote()
  it("should reject proposal with 1/3 confirmed votes", async function() {
      await proposalHelper.simulateIco({1: 1000, 2: 1000, 3: 1000});
      // create a new Proposal
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
      await proposalHelper.voteBulk(proposalID, {1: true, 2: false, 3: false})

      await contract.executeProposal.sendTransaction(proposalID)
      const p = await proposalHelper.getFormattedProposal(proposalID)
      // Proposal is executed
      expect(p.finished).toBe(true)
      // Proposal isn't passed
      expect(p.proposalPassed).toBe(false)
  })

  // vote()
  it("users that are not shareholders should not be able to vote", async function() {
      await proposalHelper.simulateIco({1: 4000});
      // Create Proposal in Field of work 2
      await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 2, {from: accounts[1]})
      let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
      // User 1 and User 3 Vote
      await contract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
      expect(contract.vote.sendTransaction(proposalID, false, {from: accounts[2]})).rejects.toEqual(expect.any(Error))
      expect(contract.vote.sendTransaction(proposalID, true, {from: accounts[3]})).rejects.toEqual(expect.any(Error))
  })

  // vote()
  it("should reject proposals with 1/3 confirmed votes", async function() {
    await proposalHelper.simulateIco({0: 10000, 1: 10000, 2: 10000});
    // create a new Proposal
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 100, 0, {from: accounts[1]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true, 1: false, 2: false})
    // execute the Proposal -> passed time is required
    await contract.executeProposal.sendTransaction(proposalID)
    // get the proposal
    const p = await proposalHelper.getFormattedProposal(proposalID)
    // proposal is finished
    expect(p.finished).toBe(true)
    // proposal isn't passed
    expect(p.proposalPassed).toBe(false)
  })

  // vote()
  it("should approve the proposal with 3/5 confirmed votes", async function() {
    await proposalHelper.simulateIco({0: 10000, 1: 10000, 2: 10000, 3: 10000, 4: 10000});
    // create a new Proposal
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[0], 100, 0, {from: accounts[0]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true, 1: true, 2: true, 3: false, 4: false})
    // execute the Proposals
    await contract.executeProposal.sendTransaction(proposalID)
    // get the proposal
    const p = await proposalHelper.getFormattedProposal(proposalID)
    // proposal is finished
    expect(p.finished).toBe(true)
    // proposal is passed
    expect(p.proposalPassed).toBe(true)
  })

  // vote()
  it("should allow to vote for a tokenholder", async function() {
    await proposalHelper.simulateIco({0: 10000, 1: 10000, 2: 10000});

    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[2], 10, 0, {from: accounts[2]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true, 1: true, 2: false})

    await contract.executeProposal.sendTransaction(proposalID)
    const p = await proposalHelper.getFormattedProposal(proposalID)

    expect(p.finished).toBe(true)
    expect(p.proposalPassed).toBe(true)
  })

  // executeProposal()
  it("checks whether the proposal gets finished after executing", async function() {
    await proposalHelper.simulateIco({1: 1000});
    //create a new Proposal
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 103, 2, {from: accounts[1]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {1: true})
    await contract.executeProposal.sendTransaction(proposalID)
    const p = await proposalHelper.getFormattedProposal(proposalID)
    // recipient of proposal is user 1
    expect(p.recipient).toBe(accounts[1])
    // value of Proposal should be 103
    expect(+p.amount).toBe(103)
    // Proposal is finished
    expect(p.finished).toBe(true)
    // Proposal passed
    expect(p.proposalPassed).toBe(true)
  })

  // executeProposal()
  it("should check whether the inital proposal is not passed and not finished", async function() {
    await proposalHelper.simulateIco({1: 100000});
    // create new proposal in FoW = 0
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[1], 29, 0, {from: accounts[1]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await contract.vote.sendTransaction(proposalID, false, {from: accounts[1]})
    // await proposalHelper.voteBulk(proposalID, {1: false})
    const p = await proposalHelper.getFormattedProposal(proposalID)
    // Proposal not finished
    expect(p.finished).toBe(false)
    // Proposal not passed
    expect(p.proposalPassed).toBe(false)
    // number of Proposals = 1
    expect(+await contract.getNumProposals.call()).toBe(1)
  })

  // newProposal()
  it("should instantiate a new proposal", async function() {
    await proposalHelper.simulateIco({0: 100000});
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[0], 10, 0, {from: accounts[0]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true})
    const p = await proposalHelper.getFormattedProposal(proposalID)
    expect(+p.amount).toBe(10)
  })

  // newProposal()
  it("should count the new created proposal", async function() {
    const numberOfInitialProposals = 0;
    await proposalHelper.simulateIco({0: 10000});
    await contract.newProposal.sendTransaction('Prop', 'Prop', accounts[0], 100, 0, {from: accounts[0]})
    expect(numberOfInitialProposals + 1).toBe(+await contract.getNumProposals())
  })

  // newDividendProposal()
  it("should be possible to create and to vote on a new dividend proposal", async function() {
    await proposalHelper.simulateIco({0: 100000, 1: 100000});
    await contract.newDividendProposal.sendTransaction(accounts[0], 100, {from: accounts[0]})

    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true, 1: true})
    await contract.executeProposal.sendTransaction(proposalID)
    const p = await proposalHelper.getFormattedProposal(proposalID)

    expect(p.recipient).toBe(accounts[0])
    expect(+p.amount).toBe(0)
    expect(p.name).toBe('Dividend')
    expect(p.description).toBe('Dividend')
    expect(+p.proposalDeadline).toBe(2200600)
    expect(p.finished).toBe(true)
    expect(p.proposalPassed).toBe(true)
    expect(+p.passedPercent).toBe(100)
    expect(+p.dividend).toBe(100)
    expect(+p.dmr).toBe(0)
  })

  // newDMRewardPropsal()
  it("should be possible to create and to vote on a new decision maker reward proposal", async function() {
    await proposalHelper.simulateIco({0: 100000, 1: 100000});
    await contract.newDMRewardProposal.sendTransaction(accounts[0], 100, {from: accounts[0]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
    await proposalHelper.voteBulk(proposalID, {0: true, 1: true})
    await contract.executeProposal.sendTransaction(proposalID)
    const p = await proposalHelper.getFormattedProposal(proposalID)

    expect(p.recipient).toBe(accounts[0])
    expect(+p.amount).toBe(0)
    expect(p.name).toBe('DMR')
    expect(p.description).toBe('DMR')
    expect(+p.proposalDeadline).toBe(2200600)
    expect(p.finished).toBe(true)
    expect(p.proposalPassed).toBe(true)
    expect(+p.passedPercent).toBe(100)
    expect(+p.dividend).toBe(0)
    expect(+p.dmr).toBe(100)
  })

  // votingAllowed
  it("should be not allowed to vote on the new proposal if the dao isn't created", async function() {
    await proposalHelper.simulateIco({0: 100000, 1: 100000});
    await contract.newDMRewardProposal.sendTransaction(accounts[0], 100, {from: accounts[0]})
    let proposalID = (await proposalHelper.listenForEvent('NewProposalCreated')).proposalID;
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
      await contract.newDMRewardProposal.sendTransaction(accounts[0], 100, {from: accounts[0]})
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
