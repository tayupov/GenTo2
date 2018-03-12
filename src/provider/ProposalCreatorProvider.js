import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';
import GentoDAOArtifact from 'assets/contracts/GentoDao'


export async function createProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);
  
  if (await willThrow(dao.newProposal, input, from)) {
    return -1;

  } else {
    return dao.newProposal.sendTransaction(...input, {from})
  }
}

export async function createDividendProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);
  if (await willThrow(dao.newDividendProposal, input, from)) {
    return -1
  } else {
    return dao.newDividendProposal.sendTransaction(...input, {from})
  }
}

export async function createDmrProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);
  if (await willThrow(dao.newDMRewardProposal, input, from)) {
    return -1
  } else {
    return dao.newDMRewardProposal.sendTransaction(...input, {from})
  }
}

async function willThrow(command, input, from) {
  try {
    await command.estimateGas(...input, {from})
    return false
  } catch (e) {
    return true
  }
}
