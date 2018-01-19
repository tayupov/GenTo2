import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';
import GentoDAOArtifact from 'assets/contracts/GentoDao'


export async function createProposal(input, from, daoAddress) {
  const GentoDAO = contract(GentoDAOArtifact);
  GentoDAO.setProvider(web3.currentProvider);

  var dao = await GentoDAO.at(daoAddress);

  return dao.newProposal.sendTransaction(... input , { from })
}