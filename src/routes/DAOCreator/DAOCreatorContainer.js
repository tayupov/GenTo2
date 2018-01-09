import React from 'react';
import IPFS from 'ipfs';

import DAOCreator from './DAOCreator';

import steps from './steps';
import web3 from 'utils/web3';
import { adjustStepZilla } from 'utils/stepzilla';

//import GenToFactory from 'assets/contracts/GenToFactory.json';
//import { createGentoFactoryInstance } from 'utils/contractInstances';

import { Buffer } from 'buffer';

export default class DAOCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: null,
			website: null,
			description: null,
			proposalIPFSHash: null,
			proposalArrayBuffer: null,
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

	async handleCreate() {
		const uploadResult = await this.uploadProposalToIPFS();
		if (uploadResult.hash) {
			this.setState({
				proposalIPFSHash: uploadResult.hash
			})
		}

		console.log(this.state)
	}

	uploadProposalToIPFS() {
		return new Promise((resolve, reject) => {

			const ipfsNode = new IPFS();
			const content = Buffer.from(this.state.proposalArrayBuffer);

			ipfsNode.on('ready', () => {
				ipfsNode.files.add({ content }, (err, files) => {
					if (err) { reject(err) }
					resolve(files[0])
				});
			});

		});
	}

	render() {
		return (
			<DAOCreator />
		)
	}
}
