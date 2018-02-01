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
		var res = 0;
		switch(this.state.proposalType){
			case 1:
				res = await createProposal(Object.values(omitInvalidProposalKeys(this.state)), from, this.props.address)
				break;
			case 2:
				res = await createDividendProposal(Object.values(omitInvalidDividendProposalKeys(this.state)), from, this.props.address)
				break;
			case 3:
				res = await createDmrProposal(Object.values(omitInvalidDmrProposalKeys(this.state)), from, this.props.address)
				break;

		}
		if(res === -1){
			this.props.notify("Proposal could not be created. Please check input and priviliges.")
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
