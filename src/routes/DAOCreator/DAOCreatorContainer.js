import React from 'react';
import IPFS from 'ipfs';

import DAOCreator from './DAOCreator';
import steps from './steps';
import web3 from 'utils/web3';

import { createOrganization } from 'provider/DAOCreatorProvider';
import { adjustStepZilla } from 'utils/stepzilla';
import { omitInvalidContractKeys } from 'utils/contracts';
import { Buffer } from 'buffer';

export default class DAOCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			totalSupply: null,
			symbol: null,
			name: null,
			startPrice: null,
			endPrice: null,
			saleStart: null,
			saleEnd: null,

			// TODO: everything below is not part of the contract _yet_
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
			selectedCurrency: null
		}
	}

	componentDidMount() {
		adjustStepZilla(steps, this)

	}

	async handleCreate() {
		const uploadResult = await this.uploadProposalToIPFS();
		if (uploadResult.success) {
			this.setState({
				proposalIPFSHash: uploadResult.file.hash
			})
		}
		
		// TODO: get rid of this helper, or maybe even keep it...
		const from = this.props.account
		const contractObj = omitInvalidContractKeys(this.state)
		const contractValues = Object.values(contractObj)
		createOrganization(contractValues, from)
	}

	// TODO: Make this a reuseable function and move it somewhere else
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
