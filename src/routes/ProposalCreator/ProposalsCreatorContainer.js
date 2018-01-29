import React from 'react';
import ProposalsCreator from './ProposalsCreator';
import steps from './steps'
import { adjustStepZilla } from 'utils/stepzilla'
import { omitInvalidProposalKeys } from 'utils/contracts';
import { createProposal } from 'provider/ProposalCreatorProvider';

export default class ProposalsCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			'name': "",
			'description': "",
			'beneficiary': "",
			'weiAmount': "",
			'fieldOfWork': ""
		}
	}

	async handleCreate() {
<<<<<<< 37436535dd234a8f9f81c8cb57bd7dbbf3d72daf

		const from = this.props.account
		const contractObj = omitInvalidProposalKeys(this.state)
		const contractValues = Object.values(contractObj)
		createProposal(contractValues, from, this.props.address)
=======
>>>>>>> I cant get git to work
	}	

	componentDidMount() {
		adjustStepZilla(steps, this);
	}

	render() {
		return (
			<ProposalsCreator />
		)
	}
}
