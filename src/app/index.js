import React from 'react';
import AlertContainer from 'react-alert';
import DAOSidebar from 'components/DAOSidebar';
import Routes from 'routes';

import web3 from 'utils/web3';
import 'styles/app.css';

import provider from 'provider'
import { loadAllOrganizations } from 'provider/DAOListProvider'

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

  async componentDidMount() {
    await provider(this.notify, this)
    const organizations = await loadAllOrganizations()
    
    this.setState({ organizations });
  }

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
