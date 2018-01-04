import React, { Component } from 'react';

import DAOList from './DAOList';

export default class DAOListContainer extends Component {

  constructor() {
    super();
    this.state = {
      gentoOrganizations: [
        {
          name: 'organization1',
          description: 'Give me your money',
          address: 'dolla-dolla-bill-yall'
        },
        {
          name: 'organization2',
          description: 'Legit company!!1',
          address: 'legit-link'
        },
        {
          name: 'organization3',
          description: 'Give me your money',
          address: 'dolla-dolla-bill-yall'
        },
        {
          name: 'organization4',
          description: 'Legit company!!1',
          address: 'legit-link'
        },
        {
          name: 'organization5',
          description: 'Give me your money',
          address: 'dolla-dolla-bill-yall'
        }
      ]
    }
  }

  componentDidMount() {
    //TODO: load gentoOrganizations
  }

  render() {
    return (
      <DAOList gentoOrganizations={this.state.gentoOrganizations} />
    );
  }
}
