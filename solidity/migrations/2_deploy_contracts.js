var tokenFactory = artifacts.require("./GenToFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(tokenFactory);
};
