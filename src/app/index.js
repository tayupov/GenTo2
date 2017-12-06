import React, { Component } from 'react';

import View from './View';

import daos from 'daos';

import AlertContainer from 'react-alert';
import web3 from 'utils/web3';

class App extends Component {

  constructor() {
    super();
    this.state = {
      account: null,
      network: null,
      active: false,
      daos: [],
      currDao: '',
      currPoll: [ 
        {
          daoName: 'Lizax',
          polls: []
        },
        {
          daoName: 'TorX',
          polls: []
        },
        {
          daoName: 'Mint',
          polls: []
        },
        {
          daoName: 'Zeltox',
          polls: []
        }
      ]
    }
  }
  
  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  componentWillMount() {
    this.listDaos();
    this.updateNetwork();
    setInterval(this.updateAccount, 1000);
  }

  setCurrDao = (daoName) => {
    this.setState({
      currDao: daoName
    })
  }

  getCurrDao = () => this.state.daos.filter(dao => dao.daoName === this.state.currDao)[0]

  setCurrPoll = (poll) => {
    const currPoll = {
      header: poll.pollName,
      endDate: new Date(poll.pollEnd),
      description: poll.pollDescription,
      addressesFor: 0,
      addressesAgainst: 0,
      tokensFor: 0,
      tokensAgainst: 0,
      voterAddresses: [],
      category: poll.pollCategory,
      state: 'active'
    }

    this.state.currPoll.filter(poll => poll.daoName === this.state.currDao)[0].polls.push(currPoll);
  } 

  listDaos = () => {
    this.setState({
      daos: daos
    })
  }

  // temporary function for creating DAOs
  createDAO = (daoDetails) => {
    this.setState({
      daoDetails
    })
  }

  updateNetwork = () => {
    web3.version.getNetwork((err, netId) => {
      if (err) {
        console.log('The network connection could not be established!');
        console.error(err);
      }
      this.setState({
        network: netId
      })
    })
  }

  updateAccount = () => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        console.log('The account could not be updated!');
        console.error(err);
      }
      if(this.state.account !== accounts[0]){
        if(this.state.account !== null)
          this.notify('Account Switched!', 'info');
        this.setState({
          account: accounts[0]
        })
      }
    });
  }

  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'light',
    time: 5000,
    transition: 'fade'
  }


  notify = (message, type) => {
    switch(type) {
      case 'info':
        return this.msg.info(message);
      case 'success':
        return this.msg.success(message);
      case 'error':
        return this.msg.error(message);
      case 'remove':
        return this.msg.removeAll();
    }
  }

  handleContextRef = contextRef => this.setState({ contextRef });

  render() {
    return (
      <div ref={this.handleContextRef}>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <View
          {...this.state}
          notify={this.notify}
          handleShow={this.handleShow}
          handleHide={this.handleHide}
          createDAO={this.createDAO}
          setCurrDao={this.setCurrDao}
          getCurrDao={this.getCurrDao}
          setCurrPoll={this.setCurrPoll}
        />
      </div>
    );
  }
}

export default App;
