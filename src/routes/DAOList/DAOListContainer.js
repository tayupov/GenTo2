import React, { Component } from 'react';
import moment from 'moment';
import DAOList from './DAOList';
import { loadAllOrganizations } from 'provider/DAOListProvider';

export default class DAOListContainer extends Component {

  constructor() {
    moment().format();
    super();
    this.state = { gentoDAOs: [], gentoICOs: [] }
  }

  async componentDidMount() {
    let gentoOrganizations = await loadAllOrganizations();
    gentoOrganizations.forEach(org => {
      org.saleStart = moment.unix(org.saleStart.c).format("DD.MM.YYYY");
      org.saleEnd = moment.unix(org.saleEnd.c).format("DD.MM.YYYY");
    })
    const gentoDAOs = gentoOrganizations.filter(org => org.isICOFinished);
    const gentoICOs = gentoOrganizations.filter(org => !org.isICOFinished);
    this.setState({ gentoDAOs, gentoICOs })
  }

  render() {
    return (
      <DAOList gentoDAOs={this.state.gentoDAOs} gentoICOs={this.state.gentoICOs} />
    );
  }
}
