const GentoDao = artifacts.require("./GentoDao.sol");
const GentoDaoDeployer = require("./util/GentoDaoDeployer.js")(GentoDao)

const should = require('should');
const expect = require('expect');


contract('StandardTokenWithShareholderList', function(accounts) {
    let contract;

    beforeEach(async function() {
      contract = await GentoDaoDeployer()
  });

  async function listenForEvent(eventName) {
    // get the event listener for the specific event
    const listener = contract[eventName]();
    const log = await new Promise((resolve, reject) => listener.get(
        (error, log) => error ? reject(error) : resolve(log)));
    // check that there one new log object
    assert.equal(log.length, 1, 'should be one new event log object');
    // return only the properties which are important for testing
    return log[0].args;
  }

  /**

  METHODS

  */

  // isShareholder()
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
    transferSuccessObj = await listenForEvent('TransferSuccess')
    expect(transferSuccessObj.success).toBe(true)
  })

  // transfer()
  it("should be possible transfer money with setBalance()", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.setBalance.sendTransaction(accounts[0], 100)
    await contract.transfer.sendTransaction(accounts[1], 10, {from: accounts[0]})
    let transferSuccessObj = await listenForEvent('TransferSuccess')
    expect(transferSuccessObj.success).toBe(true)
  })

  // removeShareholder()
  it("should be possible to remove shareholder if they are contained in the shareholder list", async function() {
    await contract.setBalance.sendTransaction(accounts[0], 100)
    await contract.setBalance.sendTransaction(accounts[1], 100)
    await contract.setBalance.sendTransaction(accounts[2], 100)
    let shareholders = (await listenForEvent('NewShareholderList')).shareholders
    console.log('shareholders: ', shareholders)
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
    let shareholders = (await listenForEvent('NewShareholderList')).shareholders
    let balanceObj = await listenForEvent('BalanceUpdated')
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
    let shareholders = (await listenForEvent('NewShareholderList')).shareholders
    expect(shareholders).toContain(accounts[0])
    // console.log('balance after buying: ', +await contract.getBalance.call(accounts[0]))
    // after setting the balance to 0 the shareholder gets removed from shareholder list
    await contract.setBalance.sendTransaction(accounts[0], 0)
    // console.log('balance after setBalance: ', +await contract.getBalance.call(accounts[0]))
    let balanceObj = await listenForEvent('BalanceUpdated')
    expect(+balanceObj.oldBalance).toBe(17)
    expect(+balanceObj.newBalance).toBe(0)
    expect(+balanceObj.balance).toBe(0)

    shareholders = (await listenForEvent('NewShareholderList')).shareholders
    expect(shareholders).not.toContain(accounts[0])

  })

  // setBalance()
  it("should ensure that the user have 0 token if they aren't shareholder", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    expect(+await contract.getBalance.call(accounts[0])).toBe(0)
    await contract.buy.sendTransaction({from: accounts[0], value: 100})
    expect(+await contract.getBalance.call(accounts[0])).toBe(3)
    let balanceObj = await listenForEvent('BalanceUpdated')

    expect(+balanceObj.oldBalance).toBe(0)
    expect(+balanceObj.newBalance).toBe(3)
    expect(+balanceObj.newBalance).toBe(+balanceObj.balance)

  })

  // onBalanceChange()
  it("should add and remove the shareholder to/from the list with onBalanceChange()", async function() {
    await contract.onBalanceChange.sendTransaction(accounts[0], 0, 100)
    let shareholders = (await listenForEvent('NewShareholderList')).shareholders
    expect(shareholders).toContain(accounts[0])

    await contract.onBalanceChange.sendTransaction(accounts[0], 100, 0)
    shareholders = (await listenForEvent('NewShareholderList')).shareholders
    expect(shareholders).not.toContain(accounts[0])
  })

  // onBalanceChange()
  it("should add the user to the shareholder list if his balance is greater then 0", async function() {
    await contract.setCurrentTime.sendTransaction(1200000)
    await contract.buy.sendTransaction({from: accounts[0], value: 500})
    await contract.onBalanceChange.sendTransaction(accounts[0], 0, 100)
    let shareholders = (await listenForEvent('NewShareholderList')).shareholders
    expect(shareholders).toContain(accounts[0])
  })

  // sendEtherToWallet()
  it("should send ether to the wallet of a shareholder", async function() {
    await contract.setBalance.sendTransaction(accounts[0], 100)
    await contract.sendEtherToWallet.sendTransaction(1, {from: accounts[0]})
  })

});