const tokenFactory = artifacts.require("./GentoDaoFactory.sol");
const AuctionToken = artifacts.require("./GentoDao.sol");
const VotingToken = artifacts.require("./Proposals.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(tokenFactory);
};
