import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';

const balanceForAccount = async (organization, address) => {
  if (!address) { return null }
  const balanceRaw = await organization.balanceOf.call(address)
  if (balanceRaw.c) {
    return balanceRaw.c[0]
  }
  return null
}

const getTotalNumberOfTokens = async (organization, address) => {
  if (!address) { return null }
  const totalBought = await organization.totalSupply()
  const remainingTokens = await organization.remainingTokensForICOPurchase()
  if (totalBought.c && remainingTokens.c) {
    const totalNumberOfTokens = totalBought.c[0] + remainingTokens.c[0];
    return totalNumberOfTokens
  }
  return null
}

export async function mapOrganization(organization, account) {
  return {
    address: await organization.address,
    name: await organization.name(),
    symbol: await organization.symbol(),
    saleStart: await organization.saleStart(),
    saleEnd: await organization.saleEnd(),
    buyPriceStart: await organization.buyPriceStart(),
    buyPriceEnd: await organization.buyPriceEnd(),
    isICOFinished: await organization.isIcoFinished(),
    numberOfProposals: await organization.getNumProposals(),
    numberOfShareholders: await organization.getShareholderCount(),
    totalSupply: await organization.totalSupply(),
    remainingTokensForICOPurchase: await organization.remainingTokensForICOPurchase(),
    descriptionHash: await organization.descriptionHash(),
    delegate: await organization.delegate,
    balanceForAccount: await balanceForAccount(organization, account),
    totalNumberOfTokens: await getTotalNumberOfTokens(organization, account),
  }
}

/* "extract" boolean flag to receive object in contrast to actual contract */
export async function loadOrganization(address, account, extract) {
  const GentoDAOContract = contract(GentoDAOArtifact);
  GentoDAOContract.setProvider(web3.currentProvider);
  
  return extract ? mapOrganization(GentoDAOContract.at(address), account) : GentoDAOContract.at(address)
}

