import GentoDAOArtifact from 'assets/contracts/GentoDao'
import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';
import fieldOfWorks from 'constants/fieldsOfWork'

const getDelegations = async (delegationsMapping, account) => {
  if (!account) { return [] }
  return Promise.all(fieldOfWorks.map(fow => delegationsMapping.call(account, parseInt(fow.value, 10))))
}

const getShareholders = async (organization, account) => {
  const shareholderCount = await organization.getShareholderCount()
  if (!shareholderCount.c) { return [] }
  let shareholders = []
  for (let i = 0; i <= shareholderCount.c[0] - 1; i++) {
    shareholders = [...shareholders, await organization.shareholders(i)]
  }
  return shareholders
}

const balanceForAddress = async (organization, address) => {
  if (!address) { return null }
  const balance = await organization.balanceOf.call(address)
  // const total = await organization.getBuyPrice()
  return balance
}

export async function mapOrganization(organization, account) {
  return {
    address: await organization.address,
    name: await organization.name(),
    symbol: await organization.symbol(),
    saleStart: await organization.saleStart(),
    saleEnd: await organization.saleEnd(),
    isICOFinished: await organization.isIcoFinished(),
    numberOfProposals: await organization.getNumProposals(),
    numberOfShareholders: await organization.getShareholderCount(),
    totalSupply: await organization.totalSupply(),
    remainingTokensForICOPurchase: await organization.remainingTokensForICOPurchase(),
    descriptionHash: await organization.descriptionHash(),
    delegate: await organization.delegate,
    delegations: await getDelegations(organization.delegations, account),
    claimDividend: await organization.claimDividend,
    claimDecisionMakerReward: await organization.claimDecisionMakerReward,
    shareholders: await getShareholders(organization, account),
    balance: await balanceForAddress(organization, account)
  }
}

/* "extract" boolean flag to receive object in contrast to actual contract */
export async function loadOrganization(address, account, extract) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);
  
  return extract ? mapOrganization(GentoDAO.at(address), account) : GentoDAO.at(address)
}