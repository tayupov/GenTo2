const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)
// const StandardToken = require("./contracts/StandardTokenWithShareholderList.sol")


const should = require('should');
const expect = require('expect');

var newProposalEventListener;
var newShareholdersEventListener;
var newBalanceEventListener;
var newTransferAmountEventListener;

async function getProposalID() {
  let newProposalLog = await new Promise((resolve, reject) => newProposalEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  // check whether the proposal gets created
  assert.equal(newProposalLog.length, 1, 'should be one new proposal');
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
  // console.log('balanceLog: ', balanceLog)
  return balanceLog[0].args;
}

async function getTransferAmount() {
  let transferAmountLog = await new Promise((resolve, reject) => newTransferAmountEventListener.get(
      (error, log) => error ? reject(error) : resolve(log)));
  assert.equal(transferAmountLog.length, 1, 'should be one new transfer');
  // console.log('balanceLog: ', balanceLog)
  return transferAmountLog[0].args.success;
}

contract('StandardTokenWithShareholderList', function(accounts) {
  let contract;
    beforeEach(async function() {
    // Every auction token is a Proposal token
    contract = await GentoDaoDeployer()
    newProposalEventListener = contract.NewProposalCreated();
    newShareholdersEventListener = contract.NewShareholderList();
    newBalanceEventListener = contract.BalanceUpdated();
    newTransferAmountEventListener = contract.TransferSuccess();
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
  it("should be possible to transfer money from one shareholder to another with buy()", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // console.log('inital balance: ', +await contract.getBalance.call(accounts[0]))
    await contract.buy.sendTransaction({from: accounts[0], value: 500})
    // console.log('balance after buying: ', +await contract.getBalance.call(accounts[0]))
    await contract.transfer.sendTransaction(accounts[1], 10, {from: accounts[0]})
    let transferSuccess = await getTransferAmount()
    expect(transferSuccess).toBe(true)
  })

  // transfer()
  it("should be possible transfer money with setBalance()", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.setBalance.sendTransaction(accounts[0], 100)
    await contract.transfer.sendTransaction(accounts[1], 10, {from: accounts[0]})
    let transferSuccess = await getTransferAmount()
    expect(transferSuccess).toBe(true)
  })

  // transferFrom()
  // it("should be possible to transfer money with transferFrom()", async function() {
  //   await contract.setCurrentTime.sendTransaction(1200000)
  //   // await contract.buy.sendTransaction({from: accounts[0], value: 500})
  //   // await contract.buy.sendTransaction({from: accounts[1], value: 400})
  //   // await contract.buy.sendTransaction({from: accounts[2], value: 300})
  //   await contract.setBalance.sendTransaction(accounts[0], 100)
  //   await contract.setBalance.sendTransaction(accounts[1], 100)
  //   await contract.setBalance.sendTransaction(accounts[2], 100)
  //   console.log('balance after buying: ', +await contract.getBalance.call(accounts[0]))
  //   console.log('balance after buying: ', +await contract.getBalance.call(accounts[1]))
  //   await contract.transferFrom.sendTransaction(accounts[0], accounts[1], 1)
  //   // let transferSuccess = await getTransferAmount()
  //   // expect(transferSuccess).toBe(true)
  //   // await contract.transferFrom.sendTransaction(accounts[0], accounts[1], 2)
  //   // transferSuccess = await getTransferAmount()
  //   // expect(transferSuccess).toBe(true)
  //   // await contract.transferFrom.sendTransaction(accounts[0], accounts[1], 3)
  //   // transferSuccess = await getTransferAmount()
  //   // expect(transferSuccess).toBe(true)
  // })

  // removeShareholder()
  it("should be possible to remove shareholder if they are contained in the shareholder list", async function() {
    await contract.setBalance.sendTransaction(accounts[0], 100)
    await contract.setBalance.sendTransaction(accounts[1], 100)
    await contract.setBalance.sendTransaction(accounts[2], 100)
    let shareholders = await getShareholders()
    expect(shareholders).toContain(accounts[0])
    expect(shareholders).toContain(accounts[1])
    expect(shareholders).toContain(accounts[2])
    await contract.removeShareholder.sendTransaction(accounts[1])
    await contract.removeShareholder.sendTransaction(accounts[2])
    // new shareholder get inserted at the end of the array
    shareholders.pop()
    shareholders.pop()
    expect(shareholders).toContain(accounts[0])
    expect(shareholders).not.toContain(accounts[1])
    expect(shareholders).not.toContain(accounts[2])

  })

  // setBalance()
  it("should be possible to set a new balance for a shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[0], value: 500})
    await contract.setBalance.sendTransaction(accounts[0], 100)
    let shareholders = await getShareholders()
    let balanceObj = await getBalance()
    expect(+balanceObj.oldBalance).toBe(17)
    expect(+balanceObj.newBalance).toBe(100)
    expect(+balanceObj.newBalance).toBe(+balanceObj.balance)
    expect(shareholders).toContain(accounts[0])
  })

  // setBalance()
  it("should remove the user from shareholder list if the new balance is 0", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    // console.log('inital balance: ', +await contract.getBalance.call(accounts[0]))
    await contract.buy.sendTransaction({from: accounts[0], value: 500})
    // after buying the shareholder gets pushed into the shareholder list
    let shareholders = await getShareholders()
    expect(shareholders).toContain(accounts[0])
    // console.log('balance after buying: ', +await contract.getBalance.call(accounts[0]))
    // after setting the balance to 0 the shareholder gets removed from shareholder list
    await contract.setBalance.sendTransaction(accounts[0], 0)
    // console.log('balance after setBalance: ', +await contract.getBalance.call(accounts[0]))
    let balanceObj = await getBalance()
    expect(+balanceObj.oldBalance).toBe(17)
    expect(+balanceObj.newBalance).toBe(0)
    expect(+balanceObj.balance).toBe(0)

    shareholders = await getShareholders()
    expect(shareholders).not.toContain(accounts[0])

  })

  // setBalance()
  it("should ensure that the user have 0 token if they aren't shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    expect(+await contract.getBalance.call(accounts[0])).toBe(0)
    await contract.buy.sendTransaction({from: accounts[0], value: 100})
    expect(+await contract.getBalance.call(accounts[0])).toBe(3)
    let balanceObj = await getBalance()

    expect(+balanceObj.oldBalance).toBe(0)
    expect(+balanceObj.newBalance).toBe(3)
    expect(+balanceObj.newBalance).toBe(+balanceObj.balance)

  })

  // onBalanceChange()
  it("should add and remove the shareholder to/from the list with onBalanceChange()", async function() {
    await contract.onBalanceChange.sendTransaction(accounts[0], 0, 100)
    let shareholders = await getShareholders()
    expect(shareholders).toContain(accounts[0])

    await contract.onBalanceChange.sendTransaction(accounts[0], 100, 0)
    shareholders = await getShareholders()
    expect(shareholders).not.toContain(accounts[0])
  })

  // onBalanceChange()
  it("should add the user to the shareholder list if his balance is greater then 0", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[0], value: 500})
    await contract.onBalanceChange.sendTransaction(accounts[0], 0, 100)
    let shareholders = await getShareholders()
    expect(shareholders).toContain(accounts[0])
  })

  // sendEtherToWallet()
  it("should send ether to the wallet of a shareholder", async function() {
    // await contract.buy.sendTransaction({from: accounts[0], value: 500})
    await contract.setBalance.sendTransaction(accounts[0], 100)
    await contract.sendEtherToWallet.sendTransaction(1, {from: accounts[0]})
  })

});
