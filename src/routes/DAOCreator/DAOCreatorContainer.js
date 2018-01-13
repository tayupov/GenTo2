import React from 'react';
import IPFS from 'ipfs';

import DAOCreator from './DAOCreator';
import steps from './steps';
import web3 from 'utils/web3';

import { createOrganization } from 'provider/DAOCreatorProvider';
import { adjustStepZilla } from 'utils/stepzilla';
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
			symbol: null,
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
		const myInput = {
			totalSupply: Math.pow(10, 18),
			symbol: "ABC",
			name: "myName",
			startPrice: 10,
			endPrice: 20,
			saleStart: Date.now(),
			saleEnd: Date.now() + 1000
		}
		console.log(this.props.account)
		if (this.props.account) {
			createOrganization(myInput, this.props.account)
		}

	}

	async handleCreate() {
		const uploadResult = await this.uploadProposalToIPFS();
		if (uploadResult.success) {
			this.setState({
				proposalIPFSHash: uploadResult.file.hash
			})
		}
		console.log(this.state)
	}

	uploadProposalToIPFS() {
		return new Promise((resolve, reject) => {

			if (this.state.proposalArrayBuffer.length > 0) {
				const ipfsNode = new IPFS();
				const content = Buffer.from(this.state.proposalArrayBuffer);

				ipfsNode.on('ready', () => {
					ipfsNode.files.add({ content }, (err, files) => {
						if (err) { reject(err) }
						resolve({
							success: true,
							file: files[0],
							errors: []
						})
					});
				});
			} else {
				resolve({
					success: false,
					file: null,
					errors: ['No proposal file provided']
				})
			}
		});
	}

	render() {
		return (
			<DAOCreator />
		)
	}
}
