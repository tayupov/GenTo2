import React from 'react';
import ProposalList from './ProposalList';

export default class ProposalListContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      proposals: [
        {
          name: 'This is my proposal',
          description: 'Give me your money',
          fieldOfWork: 'Finance',
          proposalHash: 'dolla-dolla-bill-yall',
          etherPayout: 0,
          dividend: 100,
          recipient: 'this-is-a-address',          
          proposalDeadline: '2018-01-01',
          finished: false,
          proposalPassed: false,
          passedPercent: 50,               
        },
        {
          name: 'A second proposal just for me',
          description: 'Legit company!!1',
          fieldOfWork: 'Product',
          proposalHash: 'legit-link',
          etherPayout: 0,
          dividend: 100,
          recipient: 'this-is-a-address',          
          proposalDeadline: '2018-01-01',
          finished: false,
          proposalPassed: false,
          passedPercent: 50,  
        },
        {
          name: 'This proposal is just for you',
          description: 'Give me your money',
          fieldOfWork: 'Organisation',
          proposalHash: 'dolla-dolla-bill-yall',
          etherPayout: 0,
          dividend: 100,
          recipient: 'this-is-a-address',          
          proposalDeadline: '2018-01-01',
          finished: false,
          proposalPassed: false,
          passedPercent: 50,  
        },
        {
          name: 'And this is for all of us',
          description: 'Legit company!!1',
          fieldOfWork: 'Partnership',
          proposalHash: 'legit-link',
          etherPayout: 0,
          dividend: 100,
          recipient: 'this-is-a-address',          
          proposalDeadline: '2018-01-01',
          finished: false,
          proposalPassed: false,
          passedPercent: 50,  
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
