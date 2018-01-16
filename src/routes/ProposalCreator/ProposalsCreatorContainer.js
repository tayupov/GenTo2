import React from 'react';
import ProposalsCreator from './ProposalsCreator';
import steps from './steps'
import { adjustStepZilla } from 'utils/stepzilla'

export default class ProposalsCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	async handleCreate() {
		console.log(this.state);
		// TODO Michael create Proposal
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
