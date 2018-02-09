import GentoDAOArtifact from 'assets/contracts/GentoDao'
import { default as contract } from 'truffle-contract'

import fieldsOfWorks from 'constants/fieldsOfWork'
import DID_NOT_DELEGATE_ADDRESS from 'constants/defaultAddress'

import web3 from 'utils/web3';

const getDelegationsForAccount = async (organization, account) => {
  if (!account) { return [] }

  return Promise.all(fieldsOfWorks.map(async fow => {
    const delegationAddress = await organization.delegations.call(account, fow.value)
    const influence = delegationAddress !== DID_NOT_DELEGATE_ADDRESS ?
      await organization.getInfluenceOfVoter(delegationAddress, fow.value) :
      await organization.getInfluenceOfVoter(account, fow.value)
    return {
      delegationAddress,
      influence: influence.c[0]
    }
  }))
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

const getDividenForAccount = async (organization, account) => {
  if (!account) { return null }
  const dividendRaw = await organization.dividends.call(account)
  if (dividendRaw.c) {
    return dividendRaw.c[0]
  }
  return null
}

const getVotingRewardForAccount = async (organization, account) => {
  if (!account) { return null }
  const votingRewardRaw = await organization.decisionmakerRewards(account)
  if (votingRewardRaw.c) {
    return votingRewardRaw.c[0]
  }
  return null

}

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
    const totalNumberOfTokens = totalBought.c[0] + remainingTokens.c[0]
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
    isICOFinished: await organization.isIcoFinished(),
    numberOfProposals: await organization.getNumProposals(),
    numberOfShareholders: await organization.getShareholderCount(),
    totalSupply: await organization.totalSupply(),
    remainingTokensForICOPurchase: await organization.remainingTokensForICOPurchase(),
    descriptionHash: await organization.descriptionHash(),
    delegate: await organization.delegate,
    delegationsForAccount: await getDelegationsForAccount(organization, account),
    claimDividend: await organization.claimDividend,
    claimDecisionMakerReward: await organization.claimDecisionMakerReward,
    shareholders: await getShareholders(organization, account),
    dividendForAccount: await getDividenForAccount(organization, account),
    votingRewardForAccount: await getVotingRewardForAccount(organization, account),
    balanceForAccount: await balanceForAccount(organization, account),
    totalNumberOfTokens: await getTotalNumberOfTokens(organization, account),
  }
}

/* "extract" boolean flag to receive object in contrast to actual contract */
export async function loadOrganization(address, account, extract) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  return extract ? mapOrganization(GentoDAO.at(address), account) : GentoDAO.at(address)
}
export async function isShareholder(daoAaddress, userAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  return GentoDAO.at(daoAaddress).isShareholder(userAddress)
}