import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { createGentoFactoryInstance, createAuctionTokenInstance } from 'contractInstances';

import Header from 'components/Header';
import DaoList from './DaoList';


import moment from 'moment';

class DaoListContainer extends Component {

  constructor() {
    super();

    this.state = {
      items: [],
      isLoading: true
    }
  }

  componentDidMount() {
    this.listDaos();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.account !== this.props.account) {
      this.setState({
        items: []
      }, this.listDaos())
    }
  }

  addDaoEntry = (address) => {

    // TODO fetch real DAO
    const creationDate = 12345;
    const name = "Test";
    const date =1234;

    const item = {
      address: address,
      name: name,
      date: date
    }

    let hasAddress = this.state.items.some(item => item['address'] === address)

    if (!hasAddress) {
      const newItems = this.state.items;
      newItems.push(item);
      this.setState({
        items: newItems
      })
    }

  }

  listDaos = () => {
    const owner = this.props.account;
  
    // TODO: Fetch DAOS from smart contract
      for(let x = 0; x < 4; x++) {
        this.addDaoEntry(8);
      }
      this.setState({
        isLoading: false
      })
  }


  render() {
    return (
      <div>
        <Header text="TOKEN SALES (ICO)" />
        <DaoList
          {...this.props}
          {...this.state}
        />
      </div>
    );
  }
}

DaoListContainer.propTypes = {
  account: PropTypes.string.isRequired,
  notify: PropTypes.func.isRequired
}

export default DaoListContainer;
