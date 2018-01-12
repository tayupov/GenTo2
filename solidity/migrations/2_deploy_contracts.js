const tokenFactory = artifacts.require("./GentoDaoFactory.sol");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(tokenFactory);
  const GentoFactory = await tokenFactory.deployed()
  console.log(GentoFactory)
  await GentoFactory.createContract.sendTransaction(1000000000, "YAY", "Theo Software Solutions", 10, 100, new Date().getTime() + 5000, new Date().getTime() + 10000)
  await GentoFactory.createContract.sendTransaction(1000000000, "RBR", "Rolls by the Roman", 10, 100, new Date().getTime() + 5000, new Date().getTime() + 10000)

  console.log(await GentoFactory.getICOs.call())
};
