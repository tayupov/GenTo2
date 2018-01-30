import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'

import web3 from 'utils/web3';

const mapProposal =  (proposalNumber, proposalArray) => {
  return {
      proposalNumber: proposalNumber,
      recipient:proposalArray[0],
      amount:proposalArray[1],
      name:proposalArray[2],
      description:proposalArray[3],
      proposalDeadline:proposalArray[4],
      finished:proposalArray[5],
      proposalPassed:proposalArray[6],
      passedPercent: proposalArray[7],
      fieldOfWork: proposalArray[8],
      dividend:proposalArray[9]
  }
}
const mapVote =  (voteArray) => {
  return {
      voted : voteArray[0],
      support: voteArray[1]
  }
}

export async function loadProposal(daoAddress, proposalNumber) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var proposalArray = await GentoDAO.at(daoAddress).getProposal(proposalNumber);
    return mapProposal(proposalNumber, proposalArray);
}

export async function loadVote(daoAddress, proposalNumber, address) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);
    var voteArray = await GentoDAO.at(daoAddress).getVote(proposalNumber, address); //TODO: unhandled rejection is not a function!

    return mapVote(voteArray);
}


export async function vote(daoAddress, proposalNumber, supportsProposal, from) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var dao = await GentoDAO.at(daoAddress);
    var parameters = [proposalNumber, supportsProposal]
    if (await willThrow(dao.vote, parameters, from)) {
        console.log("can not create a proposal, either the ico is still running or the user is not a shareholder. UX People, tell the user!")
    } else {
        return dao.vote.sendTransaction(...parameters, {from})
    }
}

export async function executeProposal(daoAddress, proposalNumber, from) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var dao = await GentoDAO.at(daoAddress);
    var parameters = [proposalNumber]
    if (await willThrow(dao.executeProposal, parameters, from)) {
        //TODO: clicking the execute button leads me here!
        console.log("can not create a proposal, either the ico is still running or the user is not a shareholder. UX People, tell the user!")
    } else {
        return dao.executeProposal.sendTransaction(...parameters, {from})
    }
}

async function willThrow(command, parameters, from) {
    try {
        await command.estimateGas(...parameters, {from})
        return false
    } catch (e) {
        return true
    }
}
