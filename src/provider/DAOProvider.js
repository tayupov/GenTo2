import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';

export async function mapOrganization (organization) {
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
    claimDividend: await organization.claimDividend,
    claimDecisionMakerReward: await organization.claimDecisionMakerReward
  }
}

/* "extract" boolean flag to receive object in contrast to actual contract */
export async function loadOrganization(address, extract) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);
  
  return extract ? mapOrganization(GentoDAO.at(address)) : GentoDAO.at(address)
}