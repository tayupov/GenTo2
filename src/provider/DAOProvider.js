import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';

export async function loadOrganization(address) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  return GentoDAO.at(address)
}