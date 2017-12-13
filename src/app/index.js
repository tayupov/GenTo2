import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import AlertContainer from 'react-alert';
import SideBar from 'components/SideBar';
import Routes from 'routes';

import web3 from 'utils/web3';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      account: null,
      network: null,
      active: false,
      daos: [],
      icos: [],
      currDao: null,
      currPoll: [],
      daoDetails: null
    }
  }

  componentDidMount() {
    this.updateNetwork();
    setInterval(this.updateAccount, 1000);
  }

  updateNetwork = () => {
    web3.version.getNetwork((err, network) => {
      if (err) {
        this.notify('Network not found', 'error');
      }
      this.setState({ network })
    })
  }

  updateAccount = () => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        this.notify('Account not updated', 'error');
      }
      if (this.state.account !== accounts[0]) {
        if (this.state.account !== null) {
          this.setState({ account: accounts[0] })
          this.notify('Account Switched!', 'info');
        }
      }
    });
  }


  notify = (message, type) => {
    switch (type) {
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

  render() {
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} />
        <SideBar
          />
        <Container>
          <Routes
            account={this.state.account}
            network={this.state.network}
            notify={this.notify}
            />
        </Container>
      </div>
    );
  }
}
