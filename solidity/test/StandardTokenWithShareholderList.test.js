const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)
// const StandardToken = require("./contracts/StandardTokenWithShareholderList.sol")


const should = require('should');
const expect = require('expect');

var newProposalEventListener;
var newShareholdersEventListener;
var newBalanceEventListener;

async function getProposalID() {
  let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  // check whether the proposal gets created
  assert.equal(newProposalLog.length, 1, 'should be one new Proposal');
  // returns the proposal log object with proposal id
  return newProposalLog[0].args.proposalID;
}

async function getShareholders() {
  let shareholdersLog = await new Promise((resolve, reject) => newShareholdersEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  assert.equal(shareholdersLog.length, 1, 'should be one new shareholder array');
  // console.log('shareholdersLog: ', shareholdersLog)
  return shareholdersLog[0].args.shareholders;
}

async function getBalance() {
  let balanceLog = await new Promise((resolve, reject) => newBalanceEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  assert.equal(balanceLog.length, 1, 'should be one new balance object');
  console.log('balanceLog: ', balanceLog)
  return balanceLog[0].args;
}

contract('StandardTokenWithShareholderList', function(accounts) {
  let contract;
    beforeEach(async function() {
    // Every auction token is a Proposal token
    contract = await GentoDaoDeployer()
    newProposalEventListener = contract.NewProposalCreated();
    newShareholdersEventListener = contract.NewShareholderList();
    newBalanceEventListener = contract.BalanceUpdated();
  });

  /**

  METHODS

  */

  it("should check that only if the user buys token he becomes a shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1600000)
    // user 1 become a shareholder
    await contract.buy.sendTransaction({from: accounts[1], value: web3.toWei(10, 'Gwei')})
    // check whether the account is a shareholder
    // !! converts 0 or 1 to false or true
    expect(!!+await contract.isShareholder.call(accounts[5])).toBe(false)
    expect(!!+await contract.isShareholder.call(accounts[1])).toBe(true)
  })

  // transfer()
  // it("should be possible to transfer money from one shareholder to another", async function() {
  //   await contract.setCurrentTime.sendTransaction(1200000)
  //   await contract.buy.sendTransaction({from: accounts[0], value: 100})
  //   // await contract.transfer.sendTransaction(accounts[1], 10, {from: accounts[0]})
  //
  // })
  //
  // // transferFrom()
  // it("should be transfer money with transferFrom()", async function() {
  //   await contract.setCurrentTime.sendTransaction(1200000)
  //   await contract.buy.sendTransaction({from: accounts[0], value: 100})
  //   // await contract.buy.sendTransaction({from: accounts[1], value: 100})
  //   // await contract.buy.sendTransaction({from: accounts[2], value: 100})
  //   // await contract.transferFrom(accounts[0], accounts[1], 10, {from: accounts[2]})
  //   // let token = await StandardToken.new(accounts[0], 10);
  //
  // })

  // setBlance()
  it("should be possible to set a new balance for a shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[0], value: 500})
    await contract.setBalance.call(accounts[0], 100)
    let shareholders = await getShareholders()
    expect(shareholders).toContain(accounts[0])
  })

  // it("should remove the user from shareholder list if the new balance is 0", async function() {
  //   await contract.setCurrentTime.sendTransaction(1200000)
  //   await contract.buy.sendTransaction({from: accounts[0], value: 200})
  //   let balanceObj = await getBalance()
  //   // let shareholders = await getShareholders()
  //   // expect(shareholders).toContain(accounts[0])
  //   // await contract.onBalanceChange.call(accounts[0], balanceObj.oldBalance, 0)
  //   // console.log('balance: ', balance)
  //   // expect(!!+await contract.isShareholder.call(accounts[0])).toBe(false)
  //   // let shareholders = await getShareholders()
  //   // expect(shareholders).not.toContain(accounts[0])
  //
  // })

  // setBalance()
  // BalanceUpdated event gets only triggered by invoking buy() method
  it("should ensure that the user have 0 token if they aren't shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[0], value: 100})
    let balanceObj = await getBalance()
    // console.log('balance: ', balanceObj)
    expect(+balanceObj.oldBalance).toBe(0)
    expect(+balanceObj.newBalance).toBe(3)
    expect(+balanceObj.newBalance).toBe(+balanceObj.balance)

  })

  // onBalanceChange()
  it("should add the user to the shareholder list if his balance is greater then 0", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[0], value: 500})
    await contract.onBalanceChange.call(accounts[0], 0, 100)
    let shareholders = await getShareholders()
    expect(shareholders).toContain(accounts[0])
  })

});
