import React, { Component } from 'react';

import DAOList from './DAOList';
import { loadAllOrganizations } from 'provider/DAOListProvider';

export default class DAOListContainer extends Component {

  constructor() {
    super();
    this.state = { gentoOrganizations: [] }
  }

  async componentDidMount() {
    const gentoOrganizations = await loadAllOrganizations()
    this.setState({ gentoOrganizations })
  }

  render() {
    return (
      <DAOList gentoOrganizations={this.state.gentoOrganizations} />
    );
  }
}
