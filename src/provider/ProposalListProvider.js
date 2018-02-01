import web3 from 'utils/web3';
import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'

import { loadOrganization } from './DAOProvider'

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

export async function filterExecuted (proposals) {
    const res = []
    for (let i=0; i<proposals.length; i++) {
        if (proposals[i].finished) {
            res.push(proposals[i])
        }
    }
    return res
}

export async function filterActive (proposals) {
    const res = []
    for (let i=0; i<proposals.length; i++) {
        if (!proposals[i].finished) {
            res.push(proposals[i])
        }
    }
    return res
}


export async function loadAllProposals(address) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var proposalCount = await GentoDAO.at(address).getNumProposals();
    var proposals = [];

    for(let i=0; i< proposalCount;i++){
        var proposalArray = await GentoDAO.at(address).getProposal(i);
        var proposal = mapProposal(i, proposalArray);
        proposals.push(proposal);
    }
    return proposals;
}
