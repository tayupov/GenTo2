let defaultICOdata = {
  totalSupply: 100,
  symbol: "TST",
  name: "TestToken",
  buyPriceStart: 1,
  buyPriceEnd: 2,
  sellPrice: 4,
  saleStart: new Date().getTime(),
  saleEnd: new Date().getTime()+10000
}
async function createNewICO(overrideData) {
  let data = {}
  Object.assign(data, defaultICOdata, overrideData)
  let genToFactory = await GenToFactory.deployed()
  let contract = await genToFactory.createContract.sendTransaction(
    data.totalSupply,
    data.symbol,
    data.name,
    data.buyPriceStart,
    data.buyPriceEnd,
    data.sellPrice,
    data.saleStart,
    data.saleEnd)
  let icos = await genToFactory.ICOs()

  let instance = await AuctionToken.at(icos[icos.length-1]) // It will always be the newest ICO as long as we dont run tests in parallel

  return instance;
}


const AuctionToken = artifacts.require("./AuctionToken.sol");
const GenToFactory = artifacts.require("./GenToFactory.sol");

const should = require('should')
const expect = require('expect')

contract('GenToFactory', function(accounts) {
  it("should be possible to start a valid ICO", async function() {

    try {
      let instance = await createNewICO() //Create contract with default data
      let details = await instance.getDetails.call()
      expect(details[0]).toEqual(defaultICOdata.name)
      expect(details[1]).toEqual(defaultICOdata.symbol)
      expect(details[2].c[0]).toEqual(defaultICOdata.totalSupply)
      expect(details[3].c[0]).toEqual(defaultICOdata.buyPriceStart)
      expect(details[4].c[0]).toEqual(defaultICOdata.buyPriceEnd)
      expect(details[5].c[0]).toEqual(defaultICOdata.sellPrice)
      expect(details[6].c[0]).toEqual(defaultICOdata.saleStart)
      expect(details[7].c[0]).toEqual(defaultICOdata.saleEnd)
    }
    catch (e) {
      console.error(e)
      should.fail('It should not throw an error')
    }

  });
  it("should not be possible to start an ICO with end < start", async function() {
      let invalidData={
        saleStart: new Date().getTime(),
        saleEnd: new Date().getTime() - 10000
      }
      try {
          let instance = await createNewICO(invalidData)
          should.fail("this transaction should have raised an error")
      }
      catch (e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
      }
  });

  /*
  it("should call a function that depends on a linked library", function() {
    var meta;
    var metaCoinBalance;
    var metaCoinEthBalance;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpected function, linkage may be broken");
    });
  });
  it("should send coin correctly", function() {
    var meta;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });*/
});
