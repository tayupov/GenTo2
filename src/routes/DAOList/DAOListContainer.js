import React, { Component } from 'react';
import moment from 'moment';
import DAOList from './DAOList';
import { loadAllOrganizations } from 'provider/DAOListProvider';

export default class DAOListContainer extends Component {

  constructor() {
    moment().format();
    super();
    this.state = { gentoOrganizations: [] }
  }

  async componentDidMount() {
    let gentoOrganizations = await loadAllOrganizations();
    gentoOrganizations.forEach(org => {
      org.isICOFinished ? org.isICOFinished = "ICO is running" : org.isICOFinished = "ICO is finished";
      org.saleStart = moment.unix(org.saleStart.c).format("DD.MM.YYYY");
      org.saleEnd = moment.unix(org.saleEnd.c).format("DD.MM.YYYY");
    })
    this.setState({ gentoOrganizations })
  }

  render() {
    return (
      <DAOList gentoOrganizations={this.state.gentoOrganizations} />
    );
  }
}
