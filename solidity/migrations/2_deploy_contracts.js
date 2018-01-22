const tokenFactory = artifacts.require("./GentoDaoFactory.sol");
const DAO = artifacts.require("./GentoDao.sol");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(tokenFactory);
  const GentoFactory = await tokenFactory.deployed()
  await GentoFactory.createContract.sendTransaction(web3.toWei(100, "ether"), "YAY", "Theo Software Solutions", 1, 10, 0, 100)
  await GentoFactory.createContract.sendTransaction(web3.toWei(100, "ether"), "RBR", "Rolls by the Roman", 1, 10, 0, 100)
  await GentoFactory.createContract.sendTransaction(web3.toWei(100, "ether"), "PP", "Project Paul", 1, 10, 0, 100)

  const [theo, roman, paul] = await Promise.all((await GentoFactory.getICOs.call()).map(address => DAO.at(address)))

  await theo.buy.sendTransaction({from: accounts[0], value: web3.toWei(0.001, "ether")})
  await theo.buy.sendTransaction({from: accounts[1], value: web3.toWei(0.002, "ether")})
  await theo.buy.sendTransaction({from: accounts[2], value: web3.toWei(0.001, "ether")})

  await paul.buy.sendTransaction({from: accounts[1], value: web3.toWei(0.002, "ether")})
  await paul.buy.sendTransaction({from: accounts[2], value: web3.toWei(0.001, "ether")})

  await roman.buy.sendTransaction({from: accounts[0], value: web3.toWei(0.001, "ether")})
  await roman.buy.sendTransaction({from: accounts[1], value: web3.toWei(0.002, "ether")})

  await roman.setCurrentTime.sendTransaction(100)
  await paul.setCurrentTime.sendTransaction(1000)

  await paul.newProposal.sendTransaction("Test Proposal", "Wer hier abstimmt ist doof", "0x257c1440ef68c42cb5ccc0738883e39253719610", 0, 0, {from: accounts[1]})
};
