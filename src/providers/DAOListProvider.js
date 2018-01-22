
import GentoDAOFactoryArtifact from 'assets/contracts/GentoDaoFactory'
import { default as contract } from 'truffle-contract'

import { loadOrganization } from './DAOProvider'
import web3 from 'utils/web3';

const mapOrganization = async (organization) => {
  // TODO: Give me more data
  return {
    name: await organization.name(),
    address: await organization.address,
  }
}

const filterByBalance = async (organizations, owner) => {
  const organizationsWithOwnership = []
  for (let i = 0; i < organizations.length; i++) {
    let balance = +await organizations[i].balanceOf.call(owner)
    if (balance > 0) {
      organizationsWithOwnership.push(organizations[i])
    }
  }
  return organizationsWithOwnership
}

const getOrganizations = async () => {
  const GentoDAOFactoryContract = contract(GentoDAOFactoryArtifact)
  GentoDAOFactoryContract.setProvider(web3.currentProvider);

  const gentoDAOFactory = await GentoDAOFactoryContract.deployed()
  const gentoDAOAddresses = await gentoDAOFactory.getICOs.call()
  
  const organizations = await Promise.all(gentoDAOAddresses.map(address => loadOrganization(address)))
  return organizations;
}

export async function loadAllOrganizations() {
  const organizations = await getOrganizations()
  return Promise.all(organizations.map(mapOrganization))
}

export async function loadAllOrganizationsByOwner(owner) {
  if (!owner) return []
  
  const organizations = await getOrganizations()
  const organizationsWithOwnership = await filterByBalance(organizations, owner)

  return Promise.all(organizationsWithOwnership.map(mapOrganization));
}
