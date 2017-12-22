import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import AlertContainer from 'react-alert';
import DAOSidebar from 'components/DAOSidebar';
import Routes from 'routes';

import web3 from 'utils/web3';
import 'styles/app.css';

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
      daoDetails: null,
      organizations: [],
      currentOrganization: null
    }
  }

  componentDidMount() {
    this.updateNetwork();
    setInterval(this.updateAccount, 1000);

    //TODO: remove!
    this.setState({
      organizations: [
        {
          name: 'EBikes Enterprise',
          address: 'cryptic_hash_lmao'
        },
        {
          name: 'smoke weed everyday',
          address: 'cryptic_hash_lol'
        }
      ]
    });
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
        <DAOSidebar organizations={this.state.organizations} />
        <div className="content">
          <Routes
            account={this.state.account}
            network={this.state.network}
            notify={this.notify}
          />
        </div>
      </div>
    );
  }
}
