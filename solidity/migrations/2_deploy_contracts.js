const tokenFactory = artifacts.require("./GentoDaoFactory.sol");
const DAO = artifacts.require("./GentoDao.sol");
const fieldOfWorks = ["Finance", "Organisational", "Product", "Partnership"]
const yaml = require('js-yaml');
const fs = require('fs');
const daosData = yaml.safeLoad(fs.readFileSync('../migrationsToyData/daos.yml', 'utf8')).DAOs;
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(tokenFactory);
  try {
    await initMockData(accounts)
  } catch (e) {
    console.log("FATAL: MIGRATIONS FAILED")
    console.error(e)
  }
};
async function initMockData(accounts) {
  const GentoFactory = await tokenFactory.deployed()
  const now = Math.floor(Date.now() / 1000)
  for (let k = 0; k < daosData.length; k++) {
    const daoData = daosData[k]
    console.log("Deploy DAO:", daoData.name)
    daoData.totalSupply = web3.toWei(+daoData.totalSupply, "ether") //add more digits to total supply
    daoData.saleStart += now
    daoData.saleEnd += now
    await GentoFactory.createDAO.sendTransaction(daoData.totalSupply, daoData.symbol, daoData.name, daoData.descriptionHash, daoData.buyPriceStart, daoData.buyPriceEnd, daoData.saleStart, daoData.saleEnd)
    const daoList = await GentoFactory.getDAOs.call()
    const dao = await DAO.at(daoList[daoList.length - 1])

    await dao.setCurrentTime.sendTransaction(daoData.saleStart)
    console.log("Simulate ICO:", daoData.name)
    for (let i = 0; i < daoData.owners.length; i++) {
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
    for (let i = 0; i < daoData.proposals.length; i++) {
      const proposalData = daoData.proposals[i]
      console.log("   Simulate Proposal:", proposalData.name)
      const beneficiary = proposalData.beneficiary !== undefined ? accounts[proposalData.beneficiary] : 0
      const payout = proposalData.payout ? web3.toWei(proposalData.payout, "ether") : 0
      const fieldOfWork = fieldOfWorks.indexOf((proposalData.fieldOfWork || "Product"))
      const startTime = now + (proposalData.startingDate || 0)
      //we can jump into the past safely here without breaking anything
      await dao.setCurrentTime.sendTransaction(startTime)
      if (proposalData.dividend) {
        proposalData.dividend = web3.toWei(proposalData.dividend, "ether")
        await dao.newDividendProposal.sendTransaction(proposalData.name, proposalData.description, proposalData.dividend)
      } else await dao.newProposal.sendTransaction(proposalData.name, proposalData.description, beneficiary, payout, fieldOfWork)

      if (proposalData.accepted !== undefined) {
        console.log("   ... vote on Proposal")
        const goal = proposalData.accepted
        const owners = shuffle(daoData.owners)
        let percentageInFavor = 0
        for (let j = 0; j < owners.length; j++) {
          const owner = owners[j]
          percentageInFavor += owner.percentage
          const decision = percentageInFavor > 0.5 ? goal : !goal
          await dao.vote.sendTransaction(i, decision, {
            from: accounts[owner.account]
          })
        }

        //if proposal is over and dont execute is not specifically set
        if ((await dao.proposals.call(i))[6] < now && proposalData.execute !== false) {
          console.log("  ... execute proposal")
          await dao.setCurrentTime.sendTransaction(now)
          await dao.executeProposal.sendTransaction(i)
        }
      }
    }
    await dao.setProduction.sendTransaction()
  }
}
//source : https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
