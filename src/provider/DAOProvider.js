import GentoDAOArtifact from 'assets/contracts/GentoDao'
import { default as contract } from 'truffle-contract'

import fieldsOfWorks from 'constants/fieldsOfWork'
import DID_NOT_DELEGATE_ADDRESS from 'constants/defaultAddress'

import web3 from 'utils/web3';

import promisify from 'utils/promisify'

const getDelegationsForAccount = async (organization, account) => {
  if (!account) { return [] }

  return Promise.all(fieldsOfWorks.map(async fow => {
    const delegationAddress = await organization.delegations.call(account, fow.value)
    const influenceRaw = delegationAddress !== DID_NOT_DELEGATE_ADDRESS ?
      await organization.getInfluenceOfVoter(delegationAddress, fow.value) :
      await organization.getInfluenceOfVoter(account, fow.value)
    const influence = +web3.fromWei(influenceRaw, 'finney')
    return {
      delegationAddress,
      influence
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

const getDividendForAccount = async (organization, account) => {
  if (!account) { return null }
  const dividendRaw = await organization.dividends.call(account)
  if (dividendRaw) {
    const dividend = +web3.fromWei(dividendRaw, 'ether')
    return dividend
  }
  return null
}

const getVotingRewardForAccount = async (organization, account) => {
  if (!account) { return null }
  const votingRewardRaw = await organization.decisionmakerRewards(account)
  if (votingRewardRaw) {
    const votingReward = +web3.fromWei(votingRewardRaw, 'ether')
    return votingReward
  }
  return null

}

const balanceForAccount = async (organization, address) => {
  if (!address) { return null }
  const balanceRaw = await organization.balanceOf.call(address)
  if (balanceRaw) {
    const balance = +web3.fromWei(balanceRaw, 'finney');
    return balance;
  }
  return null
}

const getTotalNumberOfTokens = async (organization, address) => {
  const totalBought = await organization.totalSupply()
  if (totalBought) {
    const totalNumberOfTokens = +web3.fromWei(totalBought, 'finney')
    return totalNumberOfTokens
  }
  return null
}

const getNumberOfTokensInICO = async (organization, address) => {
  const totalBought = await organization.totalSupply();
  const tokens = +web3.fromWei(await organization.remainingTokensForICOPurchase(), 'finney');
  if (totalBought) {
    const totalNumberOfTokens = +web3.fromWei(totalBought, 'finney'); 
    return totalNumberOfTokens + tokens;
  }
  return null
}

const getBigIntegerAsInt = async (organization, fieldName) => {
  const fieldBigInt = await organization[fieldName]()
  if (fieldBigInt) {
    const fieldInt = +web3.fromWei(fieldBigInt, 'finney')
    return fieldInt
  }
  return null
}


export async function mapOrganization(organization, account) {
  console.log('organization', organization);
  console.log('account', account);

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
    totalSupply: await getBigIntegerAsInt(organization, 'totalSupply'),
    remainingTokensForICOPurchase: await getBigIntegerAsInt(organization, 'remainingTokensForICOPurchase'),
    descriptionHash: await organization.descriptionHash(),
    delegate: await organization.delegate,
    claimProposalPayout: await organization.claimPayout,
    delegationsForAccount: await getDelegationsForAccount(organization, account),
    claimDividend: await organization.claimDividend,
    claimDecisionMakerReward: await organization.claimDecisionMakerReward,
    shareholders: await getShareholders(organization, account),
    dividendForAccount: await getDividendForAccount(organization, account),
    votingRewardForAccount: await getVotingRewardForAccount(organization, account),
    balanceForAccount: await balanceForAccount(organization, account),
    totalNumberOfTokens: await getTotalNumberOfTokens(organization, account),
    numberOfTokensInICO: await getNumberOfTokensInICO(organization, account),
    balance: +web3.fromWei(parseInt(await promisify(cb => web3.eth.getBalance(organization.address, cb))), 'finney')
  }
}

/* "extract" boolean flag to receive object in contrast to actual contract */
export async function loadOrganization(address, account, extract) {
  console.log('loadOrganization', address);

  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  return extract ? mapOrganization(GentoDAO.at(address), account) : GentoDAO.at(address)
}
export async function isShareholder(daoAaddress, userAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  return GentoDAO.at(daoAaddress).isShareholder(userAddress)
}
