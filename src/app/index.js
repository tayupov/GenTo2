import React from 'react';
import AlertContainer from 'react-alert';

import Routes from 'routes';
import DAOSidebar from 'components/DAOSidebar';

import providers from 'providers'
import { loadAllOrganizations, loadAllOrganizationsByOwner } from 'providers/DAOListProvider'

import 'styles/app.css';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      account: null,
      network: null,
      userOrganizations: [],
      gentoOrganizations: [],
      currentOrganization: null
    }
  }

  async componentDidMount() {
    await providers(this.notify, this)
    
    const gentoOrganizations = await loadAllOrganizations()
    this.setState({ gentoOrganizations })
  }

  async componentWillUpdate(nextProps, nextState) {
    if (nextState.account !== this.state.account) {
      const userOrganizations = await loadAllOrganizationsByOwner(nextState.account)
      this.setState({ userOrganizations });
    }
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
    const isLoggedIn = this.state.account !== null
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} />

        <DAOSidebar
          isLoggedIn={isLoggedIn}
          userOrganizations={this.state.userOrganizations}
          currentOrganization={this.state.currentOrganization}
          setCurrentOrganization={this.setCurrentOrganization}
          />

        <div className="content">
          <Routes
            isLoggedIn={isLoggedIn}
            notify={this.notify}
            account={this.state.account}
            network={this.state.network}
            gentoOrganizations={this.state.gentoOrganizations}
            />
        </div>

      </div>
    );
  }
}
