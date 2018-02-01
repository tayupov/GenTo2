import React from 'react';
import ProposalsCreator from './ProposalsCreator';
import steps from './steps'
import { adjustStepZilla } from 'utils/stepzilla'
import { omitInvalidProposalKeys, omitInvalidDividendProposalKeys, omitInvalidDmrProposalKeys } from 'utils/contracts';
import { createProposal, createDividendProposal, createDmrProposal } from 'provider/ProposalCreatorProvider';

export default class ProposalsCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			'name': "",
			'description': "",
			'beneficiary': "",
			'weiAmount': "",
			'fieldOfWork': "",
			'proposalType': -1
		}
	}

	async handleCreate() {
		const from = this.props.account
		console.log(this.state)
		switch(this.state.proposalType){
			case 1:
				createProposal(Object.values(omitInvalidProposalKeys(this.state)), from, this.props.address)
				break;
			case 2:
				createDividendProposal(Object.values(omitInvalidDividendProposalKeys(this.state)), from, this.props.address)
				break;
			case 3:
				createDmrProposal(Object.values(omitInvalidDmrProposalKeys(this.state)), from, this.props.address)
				break;

		}

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
