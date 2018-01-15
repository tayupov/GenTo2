import React, { Component } from 'react';
import ProposalList from './ProposalList';

export default class ProposalListContainer extends Component {

  constructor() {
    super();
    this.state = {
      proposals: [
        {
          name: 'This is my proposal',
          description: 'Give me your money',
          fieldOfWork: 'Finance',
          address: 'dolla-dolla-bill-yall'
        },
        {
          name: 'A second proposal just for me',
          description: 'Legit company!!1',
          fieldOfWork: 'Product',
          address: 'legit-link'
        },
        {
          name: 'This proposal is just for you',
          description: 'Give me your money',
          fieldOfWork: 'Organisation',
          address: 'dolla-dolla-bill-yall'
        },
        {
          name: 'And this is for all of us',
          description: 'Legit company!!1',
          fieldOfWork: 'Partnership',
          address: 'legit-link'
        },
      ]
    }
  }

  componentDidMount() {
    //TODO: load real proposals
  }

  render() {
    return (
      <ProposalList proposals={this.state.proposals} />
    );
  }
}
