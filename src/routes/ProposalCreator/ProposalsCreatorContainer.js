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
			'name': "testname",
			'description': "testdesc",
			'beneficiary': this.props.account,
			'weiAmount': 123,
			'fieldOfWork': 1
		}
	}

	async handleCreate() {
		console.log(this.props.account);
		this.state.beneficiary = this.props.account;

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
