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

  updateAccount = () => {
    web3.eth.getAccounts((err, accounts) => {
      if(this.state.account !== accounts[0]){
        if(this.state.account !== null)
          this.msg.info('Account switched');
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
        <View {...this.state} />
      </div>
    );
  }
}

export default App;
