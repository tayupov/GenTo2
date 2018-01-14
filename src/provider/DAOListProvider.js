
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
const filterByBalance = async (organizations, owner) => {
  const organizationsWithOwnership = []
  for (let i=0; i<organizations.length; i++) {
    let balance = +await organizations[i].balanceOf.call(owner)
    if (balance > 0) {
      organizationsWithOwnership.push(organizations[i])
    }
  }
  return organizationsWithOwnership
}


export async function loadAllOrganizations(owner) {
    if (!owner) return []
    
    const GentoDAOFactoryContract = contract(GentoDAOFactoryArtifact)
    GentoDAOFactoryContract.setProvider(web3.currentProvider);

    const gentoDAOFactory = await GentoDAOFactoryContract.deployed()

    const gentoDAOAddresses = await gentoDAOFactory.getICOs.call()
    const organizations = await Promise.all(gentoDAOAddresses.map(address => loadOrganization(address)))
    const organizationsWithOwnership = await filterByBalance(organizations, owner)
  //  const organizationsWithOwnership = await Promise.all()
    return Promise.all(organizationsWithOwnership.map(mapOrganization));
}
