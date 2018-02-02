const tokenFactory = artifacts.require("./GentoDaoFactory.sol");
const DAO = artifacts.require("./GentoDao.sol");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(tokenFactory);
  const GentoFactory = await tokenFactory.deployed()
  const theosHash = "QmV4CrUumLgsSLPMQTjCC65tdKFtfBTu7eVFLt7THnGtE9"
  const romansHash = "QmeQ5zEeW4vhAL1GC4GHUt2qJPB8Dws8RKJ8HFFpJYwzdK"
  const paulsHash = "QmWTY8m6uZj9uJnrkCFdJWu9htP5HcxLw1SZbdxFBUXkY4"
  await GentoFactory.createDAO.sendTransaction(web3.toWei(100, "ether"), "YAY", "Theo Software Solutions", theosHash, 1, 10, 1517562000, 1517702400)
  await GentoFactory.createDAO.sendTransaction(web3.toWei(100, "ether"), "RBR", "Rolls by the Roman", romansHash, 1, 10, 1517562000, 1517702400)
  await GentoFactory.createDAO.sendTransaction(web3.toWei(100, "ether"), "PP", "Project Paul", paulsHash, 1, 10, 1517562000, 1517702400)

  const [theo, roman, paul] = await Promise.all((await GentoFactory.getDAOs.call()).map(address => DAO.at(address)))

  await theo.buy.sendTransaction({
    from: accounts[0],
    value: web3.toWei(0.001, "ether")
  })
  await theo.buy.sendTransaction({
    from: accounts[1],
    value: web3.toWei(0.002, "ether")
  })
  await theo.buy.sendTransaction({
    from: accounts[2],
    value: web3.toWei(0.001, "ether")
  })

  await paul.buy.sendTransaction({
    from: accounts[1],
    value: web3.toWei(0.002, "ether")
  })
  await paul.buy.sendTransaction({
    from: accounts[2],
    value: web3.toWei(0.001, "ether")
  })

  await roman.buy.sendTransaction({
    from: accounts[0],
    value: web3.toWei(0.001, "ether")
  })
  await roman.buy.sendTransaction({
    from: accounts[1],
    value: web3.toWei(0.002, "ether")
  })

  await roman.setCurrentTime.sendTransaction(100)
  await paul.setCurrentTime.sendTransaction(1000)

  await paul.newProposal.sendTransaction("Test Proposal", "Wer hier abstimmt ist doof", "0x257c1440ef68c42cb5ccc0738883e39253719610", 0, 0, {from: accounts[1]})
};
