import React, { Component } from 'react';

import steps from './steps';
import DAOCreator from './DAOCreator';

import web3 from 'utils/web3';
import GenToFactory from 'assets/contracts/GenToFactory.json';
import { createGentoFactoryInstance } from 'utils/contractInstances';

export default class DAOCreatorContainer extends Component {

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
    document.getElementById('next-button')
      .addEventListener('click', this.updateCreationState)
  }

  updateCreationState = (event) => {
    const doing = document.querySelectorAll('.progtrckr-doing span')[0];
    const step = doing ? steps.find(step => step.name === doing.innerHTML) : null;
    if (step) {
      const validator = step.validator;
      const result = validator();
      if (result) {
        this.setState({ ...result })
      }
    }
  }

  render() {
    return (
      <DAOCreator />
    )
  }
}
