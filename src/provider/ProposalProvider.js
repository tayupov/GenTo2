import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'

import web3 from 'utils/web3';

const mapProposal =  (proposalNumber, proposalArray, proposalStatistics) => {
    
  return {
      proposalNumber: proposalNumber,
      recipient:proposalArray[0],
       amount:parseInt(proposalArray[1], 10),
      name:proposalArray[2],
      description:proposalArray[3],
      //proposalDeadline:proposalArray[4], // Deprecated
      finished:parseInt(proposalArray[5], 10),
      proposalPassed:proposalArray[6],
      passedPercent: parseInt(proposalArray[7], 10), // Deprecated
      fieldOfWork: proposalArray[8],
      dividend:parseInt(proposalArray[9], 10),
      approve:parseInt(proposalStatistics[0], 10),
      disapprove:parseInt(proposalStatistics[1], 10),
      percent:parseInt(proposalStatistics[2], 10),
      proposalStartTime: parseInt(proposalStatistics[3], 10),
      proposalDeadline:parseInt(proposalStatistics[4], 10),
      currentTime:parseInt(proposalStatistics[5], 10)
  }
}
const mapVote =  (voteArray, influence) => {
  return {
      voted : voteArray[0],
      support: voteArray[1],
      influence: influence
  }
}

export async function loadProposal(daoAddress, proposalNumber) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var proposalArray = await GentoDAO.at(daoAddress).getProposal(proposalNumber);
    var proposalStatistics = await GentoDAO.at(daoAddress).calculateVotingStatistics(proposalNumber);
    var mappedProposal = mapProposal(proposalNumber, proposalArray, proposalStatistics);
    console.log(mappedProposal)
    return mappedProposal;
}

export async function loadVote(daoAddress, proposal, address) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);
    var voteArray = await GentoDAO.at(daoAddress).getVote(proposal.proposalNumber, address);
    var influence = await GentoDAO.at(daoAddress).getInfluenceOfVoter(address, proposal.fieldOfWork);

    return mapVote(voteArray, influence);
}


export async function vote(daoAddress, proposalNumber, supportsProposal, from) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var dao = await GentoDAO.at(daoAddress);
    var parameters = [proposalNumber, supportsProposal]
    if (await willThrow(dao.vote, parameters, from)) {
        return -1;
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
        return -1
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
