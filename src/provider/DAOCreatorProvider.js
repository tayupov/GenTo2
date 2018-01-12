import GentoDAOFactoryArtifact from 'assets/contracts/GentoDaoFactory'
import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';

export async function createOrganization(input) {
  const GentoDAOFactoryContract = contract(GentoDAOFactoryArtifact)
  GentoDAOFactoryContract.setProvider(web3.currentProvider);

  const gentoDAOFactory = await GentoDAOFactoryContract.deployed()
  return gentoDAOFactory.createContract.sendTransaction(1000000000, "RBR", "Rolls by the Roman", 10, 100, new Date().getTime() + 5000, new Date().getTime() + 10000)
}