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
      this.setState({
        network: netId
      })
    })
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
        console.log('REMOVE THIS DAMN THING!')
        return this.msg.removeAll();
        break;
    }
  }

  updateAccount = () => {
    web3.eth.getAccounts((err, accounts) => {
      if(this.state.account !== accounts[0]){
        if(this.state.account !== null)
          this.notify('Account Switched!', 'info');
        this.setState({
          account: accounts[0]
        })
      }
    });
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
