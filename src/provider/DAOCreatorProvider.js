import GentoDAOFactoryArtifact from 'assets/contracts/GentoDaoFactory'
import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';

export async function createOrganization(input, from) {
  const GentoDAOFactoryContract = contract(GentoDAOFactoryArtifact)
  GentoDAOFactoryContract.setProvider(web3.currentProvider);

  const gentoDAOFactory = await GentoDAOFactoryContract.deployed()
  return gentoDAOFactory.createDAO.sendTransaction(...input, { from })
}
