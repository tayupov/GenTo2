import React, { Component } from 'react';
import StepZilla from 'react-stepzilla';
import { Button } from 'semantic-ui-react';

import steps from './steps';

export default class DAOCreator extends React.Component {

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

  updateState = (event) => {
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

  componentDidMount() {
    document.getElementById('next-button')
      .addEventListener('click', this.updateState)
  }

  render() {
    return (
      <StepZilla steps={steps} />
    )
  }
}
