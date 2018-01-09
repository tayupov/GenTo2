import React from 'react';
import AlertContainer from 'react-alert';
import DAOSidebar from 'components/DAOSidebar';
import Routes from 'routes';

import web3 from 'utils/web3';
import 'styles/app.css';

import provider from 'provider/index.js'

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      account: null,
      network: null,
      organizations: [],
      currentOrganization: null
    }
  }

  componentDidMount() {

    provider(this.notify, this)

    //TODO: remove!
    this.setState({
      organizations: [
      ]
    });
  }


/*
  updateAccount = () => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        this.notify('Account not updated', 'error');
      }
      console.log("state", this.state)
      if (this.state.account !== accounts[0]) {
      /*  if (this.state.account !== null) {
          this.setState({ account: accounts[0] })
          this.notify('Account Switched!', 'info');
            console.log("Account Switched")
        //}
      }
    });
  }
*/

  notify = (message, type) => {
    switch (type) {
      case 'info':
        return this.msg.info(message);
      case 'success':
        return this.msg.success(message);
      case 'remove':
        return this.msg.removeAll();
      case 'error':
      default:
        return this.msg.error(message);
    }
  }

  setCurrentOrganization = (event, element) => {
    this.setState({
      currentOrganization: element.org || null
    })
  }

  render() {
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} />

        <DAOSidebar
          organizations={this.state.organizations}
          currentOrganization={this.state.currentOrganization}
          setCurrentOrganization={this.setCurrentOrganization}
          />

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
