import React from 'react';

import DAOVotingsCreator from './DAOVotingsCreator';

import steps from './steps'
import web3 from 'utils/web3';
import { adjustStepZilla } from 'utils/stepzilla'

export default class DAOVotingsCreatorContainer extends React.Component {

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
			<DAOVotingsCreator />
		)
	}
}
