import React, { Component } from 'react';

import View from './View';

import AlertContainer from 'react-alert';
import web3 from 'utils/web3';

class App extends Component {

  constructor() {
    super();
    this.state = {
      account: null,
      network: null,
      active: false,
      daoDetails: {}
    }
  }
  
  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  componentWillMount() {
    this.updateNetwork();
    setInterval(this.updateAccount, 1000);
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
        />
      </div>
    );
  }
}

export default App;
