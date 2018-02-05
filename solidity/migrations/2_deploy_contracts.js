const tokenFactory = artifacts.require("./GentoDaoFactory.sol");
const DAO = artifacts.require("./GentoDao.sol");
const fieldOfWorks = ["Finance", "Organisational", "Product", "Partnership"]
const yaml = require('js-yaml');
const fs   = require('fs');
const daosData = yaml.safeLoad(fs.readFileSync('../migrationsToyData/daos.yml', 'utf8')).DAOs;
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(tokenFactory);
  const GentoFactory = await tokenFactory.deployed()
  const now = Math.floor(Date.now() / 1000)
  for (let i=0; i<daosData.length; i++) {
    const daoData = daosData[i]
    daoData.totalSupply = web3.toWei(+daoData.totalSupply, "ether") //add more digits to total supply
    daoData.saleStart += now
    daoData.saleEnd += now
    await GentoFactory.createDAO.sendTransaction(daoData.totalSupply, daoData.symbol, daoData.name, daoData.descriptionHash, daoData.buyPriceStart, daoData.buyPriceEnd, daoData.saleStart, daoData.saleEnd)
    const daoList = await GentoFactory.getDAOs.call()
    const dao = await DAO.at(daoList[daoList.length-1])

    await dao.setCurrentTime.sendTransaction(daoData.saleStart)
    for (let i=0; i<daoData.owners.length; i++) {
      const ownerData = daoData.owners[i]
      const buySize = ownerData.percentage * daoData.totalSupply * daoData.buyPriceStart
      await dao.buy.sendTransaction({
        from: accounts[ownerData.account],
        value: buySize
      })
    }
    if (daoData.saleEnd > now) {
      await dao.setProduction.sendTransaction()
      return
    }
    await dao.setCurrentTime.sendTransaction(daoData.saleEnd)
    for (let i=0; i<daoData.proposals.length; i++) {
      const proposalData = daoData.proposals[i]
      const beneficiary = proposalData.beneficiary !== undefined? accounts[proposalData.beneficiary] : 0
      const payout = proposalData.payout? web3.toWei(proposalData.payout, "ether") : 0
      const fieldOfWork = fieldOfWorks.indexOf(proposalData.fieldOfWork)
      await dao.newProposal.sendTransaction(proposalData.name, proposalData.description, beneficiary, payout, fieldOfWork)
    }
    await dao.setProduction.sendTransaction()
  }
};
