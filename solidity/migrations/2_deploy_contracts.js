const DAOFactory = artifacts.require("./GentoDaoFactory.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(DAOFactory);
};
