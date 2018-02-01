let defaultICOdata = {
  totalSupply: 100,
  symbol: "TST",
  name: "TestToken",
  descriptionHash: "....",
  buyPriceStart: 1,
  buyPriceEnd: 2,
  saleStart: new Date().getTime(),
  saleEnd: new Date().getTime()+10000
}

async function createNewDAO(invalidData) {
  let data = {}
  Object.assign(data, defaultICOdata, invalidData)
  let genToFactory = await GenToFactory.new()
  await genToFactory.createDAO.sendTransaction(
    data.totalSupply,
    data.symbol,
    data.name,
    data.descriptionHash,
    data.buyPriceStart,
    data.buyPriceEnd,
    data.saleStart,
    data.saleEnd)
  const daoAddress = await genToFactory.DAOs.call(0)
  const instance = await GentoDao.at(daoAddress)

  return instance;
}


const GentoDao = artifacts.require("./GentoDao.sol");
const GenToFactory = artifacts.require("./GentoDaoFactory.sol");

const should = require('should')
const expect = require('expect')

contract('GentoDaoFactory', function(accounts) {


  it("should be possible to start a valid ICO", async function() {

    try {
      let instance = await createNewDAO() //Create contract with default data
      // expect(await instance.name()).toEqual(defaultICOdata.name)
      // expect(await instance.symbol()).toEqual(defaultICOdata.symbol)
      // expect(+await instance.totalSupply()).toEqual(0) //because nothing was sold yet
      // expect(+await instance.buyPriceStart()).toEqual(defaultICOdata.buyPriceStart)
      // expect(+await instance.buyPriceEnd()).toEqual(defaultICOdata.buyPriceEnd)
      // expect(+await instance.saleStart()).toEqual(defaultICOdata.saleStart)
      // expect(+await instance.saleEnd()).toEqual(defaultICOdata.saleEnd)
      /*
      expect(+await instance.finance()).toEqual(defaultICOdata.finance)
      expect(+await instance.product()).toEqual(defaultICOdata.product)
      expect(+await instance.organisational()).toEqual(defaultICOdata.organisational)
      expect(+await instance.partner()).toEqual(defaultICOdata.partner)
      */
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
          let instance = await createNewDAO(invalidData)
          // should.fail("this transaction should have raised an error")
      }
      catch(e) {
        expect(e.message).toContain("this transaction should have raised an error")
      }
  });
});
