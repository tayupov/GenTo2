const tokenFactory = artifacts.require("./GenToFactory.sol");
const AuctionToken = artifacts.require("./AuctionToken.sol");
const VotingToken = artifacts.require("./VotingToken.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(tokenFactory);
  //Deploy a test contract with mocked time
  deployer.deploy(AuctionToken, 1000000000, "TST", "TestToken", 10, 100, 10, 1000000, 2000000, true);
  // deployer.deploy(AuctionToken, 1000000000, accounts[0], "TST", "VotingToken", 10, 100, 10, 1600000, 1900000, true);
};
