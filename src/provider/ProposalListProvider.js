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

export async function loadAllProposals(address) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var proposalCount = await GentoDAO.at(address).getNumProposals();

    console.log("proposal count" + proposalCount);
    var proposals = [];

    for(let i=0; i< proposalCount;i++){
        var proposalArray = await GentoDAO.at(address).getProposal(i);
        var proposal = mapProposal(proposalArray);
        proposals.push(proposal);
    }
    return proposals;
}
