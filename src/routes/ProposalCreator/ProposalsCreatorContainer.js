import React from 'react';

import ProposalsCreator from './ProposalsCreator';

import steps from './steps'
import web3 from 'utils/web3';
import { adjustStepZilla } from 'utils/stepzilla'

export default class ProposalsCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
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
