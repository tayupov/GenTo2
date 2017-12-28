import React from 'react';

import DAOCreator from './DAOCreator';

import steps from './steps';
import web3 from 'utils/web3';
import { adjustStepZilla } from 'utils/stepzilla';

import GenToFactory from 'assets/contracts/GenToFactory.json';
import { createGentoFactoryInstance } from 'utils/contractInstances';

export default class DAOCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: null,
			website: null,
			description: null,
			dmrReward: null,
			financePoints: null,
			productPoints: null,
			orgPoints: null,
			partnerPoints: null,
			minPartic: null,
			decidingPercentage: null,
			tokenName: null,
			tickerSymbol: null,
			totalSupply: null,
			saleStart: null,
			saleEnd: null,
			selectedCurrency: null,
			startPrice: null,
			endPrice: null,
		}
	}

	componentDidMount() {
		adjustStepZilla(steps, this)
	}

render() {
	return (
		<DAOCreator />
	)
}
}
