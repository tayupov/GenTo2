const tokenFactory = artifacts.require("./GenToFactory.sol");
const AuctionToken = artifacts.require("./AuctionToken.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(tokenFactory);
  //Deploy a test contract with mocked time
  deployer.deploy(AuctionToken, 100, accounts[0], "TST", "TestToken", 10, 100, 10, 1000000, 2000000, true);
};
