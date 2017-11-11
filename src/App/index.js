import React, { Component } from 'react';

import View from './View';

import AlertContainer from 'react-alert';
import web3 from 'myWeb3';

class App extends Component {


  constructor() {
    super();

    this.state = {
      account: null,
      network: null
    }
  }



  componentWillMount() {
    this.updateNetwork();
    setInterval(this.updateAccount, 1000);
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
        break;
      case 'success':
        return this.msg.success(message);
        break;
      case 'error':
        return this.msg.error(message);
        break;
      case 'remove':
        return this.msg.removeAll();
        break;
    }
  }


  render() {
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <View
          {...this.state}
          notify={this.notify}
        />
      </div>
    );
  }
}

export default App;
