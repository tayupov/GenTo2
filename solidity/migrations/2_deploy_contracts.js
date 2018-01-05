const tokenFactory = artifacts.require("./GenToFactory.sol");
const AuctionToken = artifacts.require("./AuctionToken.sol");
const VotingToken = artifacts.require("./VotingToken.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(tokenFactory);
};
