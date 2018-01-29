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
		const from = this.props.account
		const contractObj = omitInvalidProposalKeys(this.state)
		const contractValues = Object.values(contractObj)
		createProposal(contractValues, from, this.props.address)
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
