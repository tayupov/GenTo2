import GentoDAOArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'

import web3 from 'utils/web3';

const mapProposal = (proposalNumber, proposalArray, proposalStatistics) => {
	return {
		proposalNumber: proposalNumber,
		recipient: proposalArray[0],
		amount: getAmount(proposalArray[1]),
		name: proposalArray[2],
		description: proposalArray[3],
		//proposalDeadline:proposalArray[4], // Deprecated
		finished: proposalArray[5],
		proposalPassed: proposalArray[6],
		passedPercent: parseInt(proposalArray[7], 10), // Deprecated
		fieldOfWork: parseInt(proposalArray[8]),
		dividend: getAmount(proposalArray[9], 10),
		dmr: getAmount(proposalArray[10], 10),
		claimed: proposalArray[11],
		approve: +web3.fromWei(parseInt(proposalStatistics[0], 10), 'finney'),
		disapprove: +web3.fromWei(parseInt(proposalStatistics[1], 10), 'finney'),
		percent: parseInt(proposalStatistics[2], 10),
		proposalStartTime: parseInt(proposalStatistics[3], 10),
		proposalDeadline: parseInt(proposalStatistics[4], 10),
		proposalDeadlineFormatted: new Date(parseInt(proposalArray[4]) * 1000).toISOString().substring(0, 19).replace(/T/i, ' '),
		currentTime: parseInt(proposalStatistics[5], 10)
	}
}

const getAmount = (amountBigInt) => {
	const amount = +web3.fromWei(amountBigInt, 'ether')
	return amount
}

const mapVote = (voteArray, influence) => {
	return {
		voted: voteArray[0],
		support: voteArray[1],
		influence: +web3.fromWei(parseInt(influence, 10), 'finney')
	}
}

export async function loadProposal(daoAddress, proposalNumber) {
	const GentoDAO = contract(GentoDAOArtifact);
	GentoDAO.setProvider(web3.currentProvider);
	const DAO = await GentoDAO.at(daoAddress)
	console.log("///1")
	const proposalArray = await DAO.getProposal.call(proposalNumber);
	console.log("///2")
	const proposalStatistics = await DAO.calculateVotingStatistics.call(proposalNumber);
	console.log("///3")

	const mappedProposal = mapProposal(proposalNumber, proposalArray, proposalStatistics);

	return mappedProposal;
}

export async function loadVote(daoAddress, proposal, address) {
	const GentoDAO = contract(GentoDAOArtifact);
	GentoDAO.setProvider(web3.currentProvider);
	console.log("///4")

	var voteArray = await GentoDAO.at(daoAddress).getVote(proposal.proposalNumber, address);

	console.log("///5")
	var influence = await GentoDAO.at(daoAddress).getInfluenceOfVoter(address, proposal.fieldOfWork);

	console.log("///6")

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
		return dao.vote.sendTransaction(...parameters, { from })
	}
}

export async function onVote(daoAddress, proposalNumber, cb) {
	const GentoDAO = contract(GentoDAOArtifact);
	GentoDAO.setProvider(web3.currentProvider);
	const dao = await GentoDAO.at(daoAddress);
	dao.Voted().watch((err, response) => {
		if (err) {
			return cb(err, null)
		}
		return cb(null, response.args)
	});
}

export async function executeProposal(daoAddress, proposalNumber, from) {
	const GentoDAO = contract(GentoDAOArtifact);
	GentoDAO.setProvider(web3.currentProvider);

	var dao = await GentoDAO.at(daoAddress);
	var parameters = [proposalNumber]
	if (await willThrow(dao.executeProposal, parameters, from)) {
		return -1
	} else {
		return dao.executeProposal.sendTransaction(...parameters, { from })
	}
}

async function willThrow(command, parameters, from) {
	try {
		await command.estimateGas(...parameters, { from })
		return false
	} catch (e) {
		return true
	}
}
