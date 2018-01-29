import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';
import GentoDAOArtifact from 'assets/contracts/GentoDao'


export async function createProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);
  input[3] = 2; // TODO: THis is not set properly from fe. Setting it manually to random value
  if (await willThrow(dao, input, from)) {
    console.log("can not create a proposal, either the ico is still running or the user is not a shareholder. UX People, tell the user!")
  } else {
    return dao.newProposal.sendTransaction(...input, {from})
  }
}

async function willThrow(dao, input, from) {
  try {
    await dao.newProposal.estimateGas(...input, {from})
    return false
  } catch (e) {
    return true
  }
}
