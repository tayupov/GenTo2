import React from 'react';
import AlertContainer from 'react-alert';
import DAOSidebar from 'components/DAOSidebar';
import Routes from 'routes';
import web3Connect from 'provider/web3Provider'
import { loadAllOrganizationsOfOwner } from 'provider/DAOListProvider'
import 'styles/app.css';

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
    await web3Connect(this.notify, this)
  }

  async componentWillUpdate(nextProps, nextState) {
    if (nextState.account !== this.state.account) {
      const organizations = await loadAllOrganizationsOfOwner(nextState.account)
      this.setState({ organizations });
    }
  }

  notify = (message, type) => {
    switch (type) {
      case 'success':
        return this.msg.success(message);
      case 'remove':
        return this.msg.removeAll();
      case 'error':
        return this.msg.error(message);
      case 'info':
      default:
        return this.msg.info(message);
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
