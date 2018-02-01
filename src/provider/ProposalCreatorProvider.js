import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';
import GentoDAOArtifact from 'assets/contracts/GentoDao'


export async function createProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);

  if (await willThrow(dao.newProposal, input, from)) {
    console.log("can not create a proposal, either the ico is still running or the user is not a shareholder. UX People, tell the user!")
  } else {
    return dao.newProposal.sendTransaction(...input, {from})
  }
}

export async function createDividendProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);
  console.log("creating dividend proposal")
  console.log(input)
  if (await willThrow(dao.newDividendProposal, input, from)) {
    console.log("can not create a proposal, either the ico is still running or the user is not a shareholder. UX People, tell the user!")
  } else {
    return dao.newDividendProposal.sendTransaction(...input, {from})
  }
}

export async function createDmrProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);
  console.log("creating dmr proposal")
  console.log(input)
  if (await willThrow(dao.newDmrProposal, input, from)) {
    console.log("can not create a proposal, either the ico is still running or the user is not a shareholder. UX People, tell the user!")
  } else {
    return dao.newDmrProposal.sendTransaction(...input, {from})
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
