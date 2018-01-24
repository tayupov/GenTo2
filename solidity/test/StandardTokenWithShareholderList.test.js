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

contract('DaoWithProposals', function(accounts) {
  let contract;
    beforeEach(async function() {
    // Every auction token is a Proposal token
    contract = await GentoDaoDeployer()
    newProposalEventListener = contract.NewProposalCreated();
  });

  it("should check that only if the user buys token he becomes a shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1600000)

    // user 1 become a shareholder
    await contract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})

    // check whether the account is a shareholder
    // !! converts 0 or 1 to false or true
    expect(!!+await contract.isShareholder.call(accounts[5])).toBe(false)
    expect(!!+await contract.isShareholder.call(accounts[1])).toBe(true)
  })

});
