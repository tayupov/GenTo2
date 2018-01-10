const Proposals = artifacts.require("./Proposals.sol");
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

contract('ProposalToken', function(accounts) {
  let testContract;
  let newProposalEventListener;
    beforeEach(async function() {
    // Every auction token is a Proposal token
    testContract = await GentoDaoDeployer()
    newProposalEventListener = testContract.NewProposalCreated();
  });


  it("should check the voting for different Field of Works", async function() {
      // set time between ICO START and END
      await testContract.setCurrentTime.sendTransaction(1300000)
      // user 0,1,2,3,4,5,6 become shareholders
      await testContract.buy.sendTransaction({from: accounts[0], value: 100})
      await testContract.buy.sendTransaction({from: accounts[1], value: 200})
      await testContract.buy.sendTransaction({from: accounts[2], value: 300})
      await testContract.buy.sendTransaction({from: accounts[3], value: 400})
      await testContract.buy.sendTransaction({from: accounts[4], value: 500})
      await testContract.buy.sendTransaction({from: accounts[5], value: 600})
      // create a new proposal
      await testContract.newProposal.sendTransaction(accounts[0], 100, 1, {from: accounts[0]})
      // is necessary to get proposal id as return value by triggering the NewProposalCreated event
      let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
          (error, log) => error ? reject(error) : resolve(log)));
      // check that only 1 proosals gets created
      assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
      // returns the first proposal log object with proposal id
      let newProposalArgs = newProposalLog[0].args;
      // user 2 delegates in field of work 0 (Finance) to user 3
      await testContract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
      // user 1 delegates in field of work 0 (Finance) to user 4
      await testContract.delegate.sendTransaction(0, accounts[4], {from: accounts[1]})
      // user 1,3,4 vote for the proposal
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[1]})
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[3]})
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[4]})
      // change FieldOfWork to 2 (Product)
      await testContract.setFieldOfWork.call(2)
      // create a new proposal
      await testContract.newProposal.sendTransaction(accounts[1], 100, 1, {from: accounts[1]})
      // similar for the second proposal
      let newProposalLog2 = await new Promise((resolve, reject) => newProposalEventListener.get(
          (error, log) => error ? reject(error) : resolve(log)));
      // check whether the second proposal gets created
      assert.equal(newProposalLog2.length, 1, 'should be the second new Proposal');
      // returns the second proposal log object with proposal id
      let newProposalArgs2 = newProposalLog2[0].args;
      // user 4,5 delegates in field of work 2 (Product) to user 2
      await testContract.delegate.sendTransaction(2, accounts[2], {from: accounts[5]})
      await testContract.delegate.sendTransaction(2, accounts[2], {from: accounts[4]})
      // user 0-5 vote for the second proposal
      await testContract.vote.sendTransaction(newProposalArgs2.proposalID, true, {from: accounts[1]})
      await testContract.vote.sendTransaction(newProposalArgs2.proposalID, true, {from: accounts[2]})
      await testContract.vote.sendTransaction(newProposalArgs2.proposalID, true, {from: accounts[3]})
      await testContract.vote.sendTransaction(newProposalArgs2.proposalID, true, {from: accounts[0]})
      await testContract.vote.sendTransaction(newProposalArgs2.proposalID, true, {from: accounts[4]})
      await testContract.vote.sendTransaction(newProposalArgs2.proposalID, true, {from: accounts[5]})
      // number of proposal should be 2
      expect(+await testContract.getNumProposals()).toBe(2)
      // set time to after the proposal period
      await testContract.setCurrentTime.sendTransaction(2300000)
      // execute the first and second proposal
      await testContract.executeProposal.sendTransaction(newProposalArgs.proposalID)
      await testContract.executeProposal.sendTransaction(newProposalArgs2.proposalID)
      // get the first and second proposal by id
      var p1 = await testContract.getProposal.call(newProposalArgs.proposalID)
      var p2 = await testContract.getProposal.call(newProposalArgs2.proposalID)
      // first proposal is finished
      expect(p1[4]).toBe(true)
      // first proposal isn't passed
      expect(p1[5]).toBe(false)
      // second proposal is finished
      expect(p2[4]).toBe(true)
      // second proposal is passed
      expect(p2[5]).toBe(true)
  })



  it("should display the right number of initial Proposals", async function() {
    // number of initial proposals should be 0
    expect(+await testContract.getNumProposals.call()).toEqual(0)
  })

  it("should display correct number of Proposals", async function() {
    // set time between ICO START and END
    await testContract.setCurrentTime.sendTransaction(1300000)
    // creating a new constant for testing the right number of proposals
    const numberOfProposals = 0;
    // user 1 become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 10000})
    // create 3 new Proposals
    await testContract.newProposal.sendTransaction(accounts[1], 100, 1, {from: accounts[1]})
    expect(+await testContract.getNumProposals.call()).toBe(1 + numberOfProposals)

    await testContract.newProposal.sendTransaction(accounts[1], 200, 2, {from: accounts[1]})
    expect(+await testContract.getNumProposals.call()).toBe(2 + numberOfProposals)

    await testContract.newProposal.sendTransaction(accounts[1], 300, 2, {from: accounts[1]})
    expect(+await testContract.getNumProposals.call()).toBe(3)
  })


  it("should execute proposals with 2/3 confirmed votes", async function() {
      // set time between ICO START and END
      await testContract.setCurrentTime.sendTransaction(1200000)
      // user 1,2,3 become shareholder
      await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
      // create a new proposal
      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      // is necessary to get proposal id as return value by triggering the NewProposalCreated event
      let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
          (error, log) => error ? reject(error) : resolve(log)));
      // check that only 1 proposals gets created
      assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
      // returns the proposal log object with proposal id
      let newProposalArgs = newProposalLog[0].args;
      // user 1,2,3 vote for the proposal
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[1]})
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[2]})
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[3]})
      // set time to after the proposal period
      await testContract.setCurrentTime.sendTransaction(1300000)
      // execute the proposal
      await testContract.executeProposal.sendTransaction(newProposalArgs.proposalID)
      // get the proposal by proposal id
      const p = await testContract.getProposal.call(newProposalArgs.proposalID)
      // proposal is finished
      expect(p[4]).toBe(true)
      // proposal is passed
      expect(p[5]).toBe(true)
  })

  it("should reject proposals with 1/3 confirmed votes", async function() {
      // set time between ICO START and END
      await testContract.setCurrentTime.sendTransaction(1200000)
      // user 1,2,3 become a shareholder
      await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
      await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
      // create a new proposal
      await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
      // is necessary to get proposal id as return value by triggering the NewProposalCreated event
      let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
          (error, log) => error ? reject(error) : resolve(log)));
      // check that only 1 proposals gets created
      assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
      // returns the proposal log object with proposal id
      let newProposalArgs = newProposalLog[0].args;
      // user 1,2,3 vote for the proposal
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[1]})
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[2]})
      await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[3]})
      // set time to after the proposal period
      await testContract.setCurrentTime.sendTransaction(1300000)
      // ececute the proposal
      await testContract.executeProposal.sendTransaction(newProposalArgs.proposalID)
      // get the proposal by proposal id
      const p = await testContract.getProposal.call(newProposalArgs.proposalID);
      // proposal is finished
      expect(p[4]).toBe(true)
      // proposal isn't passed
      expect(p[5]).toBe(false)
  })

  it("checks whether the proposal gets finished after executing", async function() {
    // set time between ICO START and END
    await testContract.setCurrentTime.sendTransaction(1200000)
    // user 1 become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
    //create a new Proposal
    await testContract.newProposal.sendTransaction(accounts[1], 103, 2, {from: accounts[1]})
    let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
        (error, log) => error ? reject(error) : resolve(log)));
    assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
    let newProposalArgs = newProposalLog[0].args;
    // its important use field of work 0 (Finance) as default field of work
    // user 1 votes for the proposal
    await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[1]})
    // set time to after the proposal period
    await testContract.setCurrentTime.sendTransaction(1300000)
    // ececute the proposal
    await testContract.executeProposal.sendTransaction(newProposalArgs.proposalID)
    // get the proposal by proposal id
    const p = await testContract.getProposal.call(newProposalArgs.proposalID)
    // recipient of the proposal is user 1
    expect(p[0]).toBe(accounts[1])
    // value of the proposal should be 103
    expect(Number(p[1])).toBe(103)
    // proposal is finished
    expect(p[4]).toBe(true)
    // proposal is passed
    expect(p[5]).toBe(true)
  })

  it("should check whether the inital Proposal is not passed and not finished", async function() {
    // set time between ICO START and END
    await testContract.setCurrentTime.sendTransaction(1300000)
    // user 1 become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 100000})
    // create a new proposal for field of work 0 (Finance)
    await testContract.newProposal.sendTransaction(accounts[1], 29, 0, {from: accounts[1]})

    let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
        (error, log) => error ? reject(error) : resolve(log)));
    assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
    let newProposalArgs = newProposalLog[0].args;
    // user 1 votes for the proposal
    await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[1]})
    // get the proposal by proposal id
    const p = await testContract.getProposal.call(newProposalArgs.proposalID)
    // proposal isn't finished
    expect(p[4]).toBe(false)
    // proposal isn't passed
    expect(p[5]).toBe(false)
    // number of proposals is 1
    expect(+await testContract.getNumProposals.call()).toBe(1)
  })

  it("should compute the right influence of shareholder", async function() {
    // set time between ICO START and END
    await testContract.setCurrentTime.sendTransaction(1300000)
    // set the FieldOfWork to 1 (Organisational) instead of Finance
    await testContract.setFieldOfWork.call(1)
    // user 1, 5 and 6 become shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
    await testContract.buy.sendTransaction({from: accounts[5], value: 1000})
    await testContract.buy.sendTransaction({from: accounts[6], value: 1000})
    // user 5,6 delegate in field of work 1 to user 1
    await testContract.delegate.sendTransaction(1, accounts[1], {from: accounts[5]})
    await testContract.delegate.sendTransaction(1, accounts[1], {from: accounts[6]})
    // influence of voting power of user 1 should be 81
    expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(81)
    // influence of voting power of user 5 is 0
    expect(+await testContract.getInfluenceOfVoter.call(accounts[5], 1)).toBe(0)
  })

  //it("should compute the influence of shareholder in different field of works")

  it("should instantiate a new proposal", async function() {
    // set time between ICO START and END
    await testContract.setCurrentTime.sendTransaction(1300000)
    // user 0 become a shareholder
    await testContract.buy.sendTransaction({from: accounts[0], value: 100000})
    // create a new proposal in field of work 0 (Finance)
    await testContract.newProposal.sendTransaction(accounts[0], 10, 0, {from: accounts[0]})

    let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
        (error, log) => error ? reject(error) : resolve(log)));

    assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
    let newProposalArgs = newProposalLog[0].args;
    // user 0 votes for the new proposal
    await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[0]})
    // set time to after the proposal period
    await testContract.setCurrentTime.sendTransaction(2300000)
    // execute the proposals
    await testContract.executeProposal.sendTransaction(newProposalArgs.proposalID)
    // get the proposal by proposal id
    const p = await testContract.getProposal.call(newProposalArgs.proposalID)
    // the creator of the proposal is user 0
    expect(p[0]).toBe(accounts[0])
    // the amount of token in the poposal should be 10
    expect(Number(p[1])).toBe(10)
    // the field of work of the proposal should be 0 (Finance)
    expect(+await testContract.getFieldOfWork.call()).toBe(0)
    // the proposal is finished
    expect(p[4]).toBe(true)
    // the proposal is passed
    expect(p[5]).toBe(true)


  })

  it("should pass the proposal when the shareholder has delegated his vote", async function() {
    // set time between ICO start and END
    await testContract.setCurrentTime.sendTransaction(1400000)
    // user 1 and user 3 should become a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
    await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
    // user 3 delegates his voting power in field of work 0 (Finance) to user 1
    await testContract.delegate.sendTransaction(0, accounts[1], {from: accounts[3]})
    // first create a new Proposal before user can vote
    await testContract.newProposal.sendTransaction(accounts[1], 10, 0, {from: accounts[1]})

    let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
        (error, log) => error ? reject(error) : resolve(log)));
    assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
    let newProposalArgs = newProposalLog[0].args;
    // user 1,3 vote for the proposal
    await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[3]})
    // user 1 has more voting power then user 3
    await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[1]})
    // Set time to after the Proposal period
    await testContract.setCurrentTime.sendTransaction(2300000)
    // executes the proposal
    await testContract.executeProposal.sendTransaction(0)
    // get the proposal by id
    const p = await testContract.getProposal.call(newProposalArgs.proposalID);
    // proposal is finished
    expect(p[4]).toBe(true)
    // proposal is passed
    expect(p[5]).toBe(true)
  })

  it("should fail the delegation if the tokenholder isn't a shareholder", async function() {
    // set time between ICO start and END
    await testContract.setCurrentTime.sendTransaction(1200000)
    try {
      // user 9 is not a shareholder because he didn't buy anything
      // user 9 tries to delegate
      await testContract.delegate.sendTransaction(0, accounts[9], {from: accounts[9]})
      should.fail("this transaction should have raised an error")
    } catch (e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
    }
  })

  it("should create a new proposal", async function() {
    // set time between ICO start and END
    await testContract.setCurrentTime.sendTransaction(1600000)
    // used for counting the porposals
    var numberOfInitialProposals = 0;
    // user 0 becomes a shareholder
    await testContract.buy.sendTransaction({from: accounts[0], value: 10000})
    // create a new proposal
    await testContract.newProposal.sendTransaction(accounts[0], 100, 0, {from: accounts[0]})
    // number of proposals should be 1
    expect(numberOfInitialProposals + 1).toBe(+await testContract.getNumProposals())
  })


  it("should check that only if the user buys token he becomes a shareholder", async function() {
    // set time between ICO start and END
    await testContract.setCurrentTime.sendTransaction(1600000)
    // user 1 becomes a shareholder
    await testContract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})
    // check whether the account is a shareholder
    // !! converts 0 or 1 to false or true
    expect(!!+await testContract.isShareholder.call(accounts[5])).toBe(false)
    expect(!!+await testContract.isShareholder.call(accounts[1])).toBe(true)
  })
  //
  // it("schould reject Proposals with 1/3 confirmed votes", async function() {
  //   // Set time between ICO start and END
  //   await testContract.setCurrentTime.sendTransaction(1300000)
  //   // user 0,1,2 become shareholder
  //   await testContract.buy.sendTransaction({from:accounts[0], value: 10000})
  //   await testContract.buy.sendTransaction({from:accounts[1], value: 10000})
  //   await testContract.buy.sendTransaction({from:accounts[2], value: 10000})
  //   // create a new Proposal
  //   await testContract.newProposal.sendTransaction(accounts[1], 100, 0, {from: accounts[1]})
  //   let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
  //       (error, log) => error ? reject(error) : resolve(log)));
  //   assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
  //   let newProposalArgs = newProposalLog[0].args;
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[0]})
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[1]})
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[2]})
  //   // Set time to after the Proposal period
  //   await testContract.setCurrentTime.sendTransaction(1400000)
  //   // execute the Proposal -> passed time is required
  //   await testContract.executeProposal.sendTransaction(+await testContract.getNumProposals()-1)
  //   // get the proposal
  //   const p = await testContract.getProposal.call(+await testContract.getNumProposals()-1);
  //   // proposal is finished
  //   expect(p[4]).toBe(true)
  //   // proposal isn't passed
  //   expect(p[5]).toBe(false)
  // })
  //
  // it("should approve the Proposal with 3/5 confirmed votes", async function() {
  //   // Set time between ICO start and END
  //   await testContract.setCurrentTime.sendTransaction(1400000)
  //   // user 0,1,2,3,4 become shareholder
  //   await testContract.buy.sendTransaction({from: accounts[0], value: 10000})
  //   await testContract.buy.sendTransaction({from: accounts[1], value: 10000})
  //   await testContract.buy.sendTransaction({from: accounts[2], value: 10000})
  //   await testContract.buy.sendTransaction({from: accounts[3], value: 10000})
  //   await testContract.buy.sendTransaction({from: accounts[4], value: 10000})
  //   // create a new Proposal
  //   await testContract.newProposal.sendTransaction(accounts[0], 100, 0, {from: accounts[0]})
  //   let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
  //       (error, log) => error ? reject(error) : resolve(log)));
  //   assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
  //   let newProposalArgs = newProposalLog[0].args;
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[0]})
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[1]})
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[2]})
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[3]})
  //   await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[4]})
  //   // Set time to after the Proposal period
  //   await testContract.setCurrentTime.sendTransaction(1500000)
  //   // execute the Proposals
  //   await testContract.executeProposal.sendTransaction(newProposalArgs.proposalID)
  //   // get the proposal
  //   const p = await testContract.getProposal.call(newProposalArgs.proposalID);
  //   // proposal is finished
  //   expect(p[4]).toBe(true)
  //   // proposal is passed
  //   expect(p[5]).toBe(true)
  // })
  //
  // it("should count the correct number of Proposals", async function() {
  //   await testContract.setCurrentTime.sendTransaction(1600000)
  //
  //   await testContract.buy.sendTransaction({from: accounts[4], value: 10000})
  //   await testContract.buy.sendTransaction({from: accounts[5], value: 10000})
  //   await testContract.buy.sendTransaction({from: accounts[7], value: 10000})
  //
  //   // should be 0
  //   const numberOfInitialProposals = await testContract.getNumProposals.call()
  //
  //   await testContract.newProposal.sendTransaction(accounts[5], 10, 0, {from: accounts[5]})
  //   await testContract.newProposal.sendTransaction(accounts[4], 20, 0, {from: accounts[4]})
  //   await testContract.newProposal.sendTransaction(accounts[7], 3, 0, {from: accounts[7]})
  //
  //   expect(+await testContract.getNumProposals.call()).toBe(3 + Number(numberOfInitialProposals))
  // })
  //
  // // it("should allow to vote for a tokenholder", async function() {
  // //   await testContract.setCurrentTime.sendTransaction(1600000)
  // //
  // //   await testContract.buy.sendTransaction({from: accounts[0], value: 10000})
  // //   await testContract.buy.sendTransaction({from: accounts[1], value: 10000})
  // //   await testContract.buy.sendTransaction({from: accounts[2], value: 10000})
  // //
  // //   await testContract.newProposal.sendTransaction(accounts[2], 10, 0, {from: accounts[2]})
  // //
  // //   await testContract.vote.sendTransaction(0, true, {from: accounts[0]})
  // //   await testContract.vote.sendTransaction(0, true, {from: accounts[1]})
  // //   await testContract.vote.sendTransaction(0, false, {from: accounts[2]})
  // //
  // //   const p = await testContract.getProposal.call(0)
  // //   console.log(p)
  // //   // it doesn't work and returns undefined, getter for complex data types not allowed!
  // //   expect(+await p.votes.length).toBe(3)
  // //   expect(+await p.voted).toBe(true)
  // // })
  //
  // it("should allow delegation to other users", async function() {
  //     // Set time between ICO start and END
  //     await testContract.setCurrentTime.sendTransaction(1200000)
  //     // Let three users buy token
  //     await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
  //     await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
  //     await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
  //     // Set time to after ICO
  //     await testContract.setCurrentTime.sendTransaction(2200000)
  //     // Create Proposal in Field of work 2
  //     await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
  //     let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
  //         (error, log) => error ? reject(error) : resolve(log)));
  //     assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
  //     let newProposalArgs = newProposalLog[0].args;
  //     // User 2 delegates power in Field of Work 0 to User 3
  //     await testContract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
  //     // User 1 and User 3 Vote
  //     await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[1]})
  //     await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[3]})
  //     // Set time to after the Proposal period
  //     await testContract.setCurrentTime.sendTransaction(2300000)
  //     // End Proposal
  //     await testContract.executeProposal.sendTransaction(0)
  //     // getNumProposals()-1 because it accesses the Proposal in the Proposal array
  //     const p = await testContract.getProposal.call(newProposalArgs.proposalID);
  //     // Proposal should pass with 33 or 55 % ??? it should return 55% but it returns 33%
  //     expect(Number(p[6])).toBe(33)
  //     expect(p[4]).toBe(true)
  // })
  //
  // it("delegation in one field should not affect the others", async function() {
  //     // Set time between ICO start and END
  //     await testContract.setCurrentTime.sendTransaction(1200000)
  //     // Let three users buy token
  //     await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
  //     await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
  //     await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
  //     // Set time to after ICO
  //     await testContract.setCurrentTime.sendTransaction(2200000)
  //     // set FieldOfWork to Product
  //     await testContract.setFieldOfWork.call(2)
  //     // Create Proposal in Field of work 2
  //     await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
  //     let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
  //         (error, log) => error ? reject(error) : resolve(log)));
  //     assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
  //     let newProposalArgs = newProposalLog[0].args;
  //     // User 2 delegates power in all Field of Works except 2 to User 3
  //     await testContract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
  //     await testContract.delegate.sendTransaction(1, accounts[3], {from: accounts[2]})
  //     await testContract.delegate.sendTransaction(3, accounts[3], {from: accounts[2]})
  //     // User 1 and User 3 Vote
  //     await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[1]})
  //     await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[3]})
  //     // Set time to after the Proposal period
  //     await testContract.setCurrentTime.sendTransaction(2300000)
  //     // End Proposal
  //     await testContract.executeProposal.sendTransaction(0)
  //     // Get Proposal details
  //     const p = await testContract.getProposal.call(newProposalArgs.proposalID);
  //     // Proposal should pass with 33 %
  //     expect(Number(p[6])).toBe(33)
  //     expect(p[4]).toBe(true)
  // })
  //
  // it("delegation after ending a vote should not have an effect on the vote", async function() {
  //     // Set time between ICO start and END
  //     await testContract.setCurrentTime.sendTransaction(1200000)
  //     // Let three users buy token
  //     await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
  //     await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
  //     await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
  //     // Set time to after ICO
  //     await testContract.setCurrentTime.sendTransaction(2200000)
  //     // set FieldOfWork to Product
  //     await testContract.setFieldOfWork.call(2)
  //     // Create Proposal in Field of work 2
  //     await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
  //     let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
  //         (error, log) => error ? reject(error) : resolve(log)));
  //     assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
  //     let newProposalArgs = newProposalLog[0].args;
  //     // User 1 and User 3 Vote
  //     await testContract.vote.sendTransaction(newProposalArgs.proposalID, false, {from: accounts[1]})
  //     await testContract.vote.sendTransaction(newProposalArgs.proposalID, true, {from: accounts[3]})
  //     // Set time to after the Proposal period
  //     await testContract.setCurrentTime.sendTransaction(2300000)
  //     // End Proposal
  //     await testContract.executeProposal.sendTransaction(newProposalArgs.proposalID)
  //     // User 2 delegates power in Field of Work 2 to User 3
  //     await testContract.delegate.sendTransaction(2, accounts[0], {from: accounts[2]})
  //     // Get Proposal details
  //     const p = await testContract.getProposal.call(newProposalArgs.proposalID);
  //     // Proposal should pass with 33 %
  //     expect(Number(p[6])).toBe(33)
  //
  // })
  //
  // it("users that are not shareholders should not be able to vote", async function() {
  //     // Set time between ICO start and END
  //     await testContract.setCurrentTime.sendTransaction(1200000)
  //     // Let three users buy token
  //     await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
  //     // Set time to after ICO
  //     await testContract.setCurrentTime.sendTransaction(2200000)
  //     // set FieldOfWork to Product
  //     await testContract.setFieldOfWork.call(2)
  //     // Create Proposal in Field of work 2
  //     await testContract.newProposal.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
  //     let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
  //         (error, log) => error ? reject(error) : resolve(log)));
  //     assert.equal(newProposalLog.length, 1, 'should be 1 new Proposal');
  //     let newProposalArgs = newProposalLog[0].args;
  //     // User 1 and User 3 Vote
  //     await testContract.vote.sendTransaction(0, false, {from: accounts[1]})
  //     await expect(testContract.vote.sendTransaction(0, false, {from: accounts[2]})).rejects.toEqual(expect.any(Error))
  //     await expect(testContract.vote.sendTransaction(0, true, {from: accounts[3]})).rejects.toEqual(expect.any(Error))
  // })
  //
  // it("tests that user become shareholer only if they buy some shares", async function() {
  //   await testContract.setCurrentTime.sendTransaction(1200000)
  //   // user 7 isn't a shareholder because he didn't buy anything
  //   const isSharehoder1 = await testContract.isShareholder.call(accounts[7]);
  //   // !! converts 0 to false
  //   expect(!!isSharehoder1).toBe(false);
  //   // user 2 becomes a shareholder
  //   await testContract.buy.sendTransaction({from: accounts[2],value: 4000})
  //
  //   const isSharehoder2 = await testContract.isShareholder.call(accounts[2]);
  //   expect(!!isSharehoder2).toBe(true);
  // })
  // it("schould delegate properly", async function() {
  //       await testContract.setCurrentTime.sendTransaction(1200000)
  //
  //       // user 1,2,3,4 become shareholder evenly
  //       await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
  //       await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
  //       await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
  //       await testContract.buy.sendTransaction({from: accounts[4], value: 1000})
  //
  //       // Field of work 1 influence is distributed evenly
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(35)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[2], 1)).toBe(35)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[3], 1)).toBe(35)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[4], 1)).toBe(35)
  //
  //
  //       // Delegate influence from field of work from account 1 to 2
  //       await testContract.delegate.sendTransaction(1, accounts[2], {from: accounts[1]})
  //
  //       // Test field of work 1 incluence
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 1)).toBe(0)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[2], 1)).toBe(70)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[3], 1)).toBe(35)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[4], 1)).toBe(35)
  //
  //       // Test other field of work (To see if it is untouched)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[1], 2)).toBe(35)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[2], 2)).toBe(35)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[3], 2)).toBe(35)
  //       expect(+await testContract.getInfluenceOfVoter.call(accounts[4], 2)).toBe(35)
  //
  // })
});


/*
await testContract.buy.sendTransaction({from: accounts[0], value: 10})

expect(+await getInfluenceOfVoter({from: accounts[0]}, 0)).toContain(0)
expect(+await getInfluenceOfVoter({from: accounts[1]}, 0)).toContain(10)
*/
