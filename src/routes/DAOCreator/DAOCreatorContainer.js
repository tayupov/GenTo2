import React from 'react';
import DAOCreator from './DAOCreator';
import steps from './steps';
import { createOrganization } from 'provider/DAOCreatorProvider';
import uploadString from 'provider/IPFSUploadProvider'
import { adjustStepZilla } from 'utils/stepzilla';
import { omitInvalidContractKeys } from 'utils/contracts';

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
		const descriptionHash = await uploadString(this.state.description)
		const from = this.props.account
		const contractObj = omitInvalidContractKeys(this.state)
		const contractValues = Object.values(contractObj)
		contractValues.splice(3, 0, descriptionHash)
		
		createOrganization(contractValues, from)
	}

	render() {
		return (
			<DAOCreator />
		)
	}
}
