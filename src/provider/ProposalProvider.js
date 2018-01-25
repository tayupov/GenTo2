import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'

import { loadOrganization } from './DAOProvider'
import web3 from 'utils/web3';

const mapProposal =  (proposalArray) => {
  return {
      recipient:proposalArray[0],
      amount:proposalArray[1],
      name:proposalArray[2],
      description:proposalArray[3],
      proposalDeadline:proposalArray[4],
      finished:proposalArray[5],
      proposalPassed:proposalArray[6],
      passedPercent: proposalArray[7],
      dividend:proposalArray[8]
  }
}

export async function loadProposals(daoAddress, proposalNumber) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var proposalArray = await GentoDAO.at(daoAddress).getProposal(proposalNumber);
    return mapProposal(proposalArray);
}


export async function voteOnProposal(daoAddress, proposalNumber, supportsProposal, from) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var dao = await GentoDAO.at(daoAddress);
    parameters = [proposalNumber, supportsProposal]
    if (await willThrow(dao, parameters, from)) {
        console.log("can not create a proposal, either the ico is still running or the user is not a shareholder. UX People, tell the user!")
    } else {
        return dao.vote.sendTransaction(...input, {from})
    }
}

async function willThrow(dao, parameters, from) {
    try {
        await dao.vote.estimateGas(...parameters, {from})
        return false
    } catch (e) {
        return true
    }
}
