import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'

import { loadOrganization } from './DAOProvider'
import web3 from 'utils/web3';

const mapProposal = async (organization) => {
  return {
    name: await organization.name(),
    address: await organization.address
  }
}

export async function loadAllProposals(address) {
    const GentoDAO = contract(GentoDAOArtifact);
    GentoDAO.setProvider(web3.currentProvider);

    var proposalCount = await GentoDAO.at(address).getNumProposals();

    console.log("proposal count" + proposalCount);
    var proposals = [];

    for(let i=0; i< proposalCount;i++){
        proposals.push({
            name:"test",
            description:"test",
            proposalHash:"test"
        });
    }
    return proposals;
}
