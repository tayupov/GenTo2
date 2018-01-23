
import GentoDAOFactoryArtifact from 'assets/contracts/GentoDaoFactory'
import { default as contract } from 'truffle-contract'

import { loadOrganization } from './DAOProvider'
import web3 from 'utils/web3';

const mapOrganization = async (organization) => {
  return {
    address: await organization.address,
    name: await organization.name(),
    symbol: await organization.symbol(),
    saleStart: await organization.saleStart(),
    saleEnd: await organization.saleEnd(),
    isICOFinished: await organization.isIcoFinished(),
    numberOfProposals: await organization.getNumProposals()
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

async function prepareOrganizations() {
  const GentoDAOFactoryContract = contract(GentoDAOFactoryArtifact)
  GentoDAOFactoryContract.setProvider(web3.currentProvider)
  const gentoDAOFactory = await GentoDAOFactoryContract.deployed()
  const gentoDAOAddresses = await gentoDAOFactory.getDAOs.call()
  const organizations = await Promise.all(gentoDAOAddresses.map(address => loadOrganization(address)))
  return organizations
}

export async function loadAllOrganizations() {
  const organizations = await prepareOrganizations()
  return Promise.all(organizations.map(mapOrganization))
}

export async function loadAllOrganizationsOfOwner(owner) {
    if (!owner) return []
    const organizations = await prepareOrganizations()
    const organizationsWithOwnership = await filterByBalance(organizations, owner)
    return Promise.all(organizationsWithOwnership.map(mapOrganization))
}
