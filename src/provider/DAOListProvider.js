
import GentoDAOFactoryArtifact from 'assets/contracts/GentoDaoFactory'
import { default as contract } from 'truffle-contract'

import { loadOrganization } from './DAOProvider'
import web3 from 'utils/web3';

const mapOrganization = async (organization) => {
  return {
    name: await organization.name(),
    address: await organization.address
  }
}

export async function loadAllOrganizations() {
    const GentoDAOFactoryContract = contract(GentoDAOFactoryArtifact)
    GentoDAOFactoryContract.setProvider(web3.currentProvider);
    
    const gentoDAOFactory = await GentoDAOFactoryContract.deployed()

    const gentoDAOAddresses = await gentoDAOFactory.getICOs.call()
    const organizations = await Promise.all(gentoDAOAddresses.map(address => loadOrganization(address)))
    return Promise.all(organizations.map(mapOrganization));
}
