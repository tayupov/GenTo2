import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

export default class DAOSidebar extends Component {

  render() {
    const { organizations, currentOrganization, setCurrentOrganization } = this.props;
    const currentAddress = currentOrganization ? currentOrganization.address : null;
    return (
      <Sidebar width={"thin"} as={Menu} vertical visible={true} inverted icon="labeled">

        <Menu.Item as={Link} to="/" onClick={setCurrentOrganization}>
          <Icon name="home" />
        </Menu.Item>

        <Menu.Item as={Link} to="/dao/list" onClick={setCurrentOrganization}>
          <Icon name="list" />
        </Menu.Item>

        {organizations.map((org, index) => {
          return (
            <Menu.Item
              org={org}
              key={index} 
              as={Link}
              to={{ pathname: `/dao/${org.address}` }}
              onClick={setCurrentOrganization}
              active={currentAddress === org.address}
              >
              <Menu.Header>{org.name}</Menu.Header>
            </Menu.Item>
          )
        })}

        <Menu.Item as={Link} to="/dao/create" onClick={setCurrentOrganization}>
          <Icon name="add square" />
        </Menu.Item>
      </Sidebar>
    )
  }
}
