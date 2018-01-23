const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)


const should = require('should');
const expect = require('expect');


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

  /*it("shouldn't be possible for a shareholder to claim DMR if he doesn't get delegated VP", async function() {
      await contract.setCurrentTime.sendTransaction(1200000)
      await contract.buy.sendTransaction({from: accounts[1], value: 200})
      await contract.buy.sendTransaction({from: accounts[2], value: 200})
      await contract.buy.sendTransaction({from: accounts[3], value: 200})
      await contract.setCurrentTime.sendTransaction(2200000)
      await contract.newProposal.sendTransaction(accounts[1], 345, 0, {from: accounts[1]})
      let proposalID = await getProposalID()
  })*/

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


});
