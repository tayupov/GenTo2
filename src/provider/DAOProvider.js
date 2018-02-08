import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';

export async function mapOrganization (organization) {
  console.log(organization);
  return {
    address: await organization.address,
    name: await organization.name(),
    symbol: await organization.symbol(),
    buyPriceStart: await organization.buyPriceStart(),
    buyPriceEnd: await organization.buyPriceEnd(),
    saleStart: await organization.saleStart(),
    saleEnd: await organization.saleEnd(),
    isICOFinished: await organization.isIcoFinished(),
    numberOfProposals: await organization.getNumProposals(),
    numberOfShareholders: await organization.getShareholderCount(),
    totalSupply: await organization.totalSupply(),
    remainingTokensForICOPurchase: await organization.remainingTokensForICOPurchase(),
    descriptionHash: await organization.descriptionHash(),
    delegate: await organization.delegate
  }
}

/* "extract" boolean flag to receive object in contrast to actual contract */
export async function loadOrganization(address, extract) {
  const GentoDAOContract = contract(GentoDAOArtifact);
  GentoDAOContract.setProvider(web3.currentProvider);
  
  // const GentoDAO = await GentoDAOContract.deployed(); 
  
  return extract ? mapOrganization(GentoDAOContract.at(address)) : GentoDAOContract.at(address)
}

