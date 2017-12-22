import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Sidebar, Menu, Button, Icon } from 'semantic-ui-react';

export default class DAOSidebar extends Component {

  render() {
    const organizations = this.props.organizations;
    return (
      <Sidebar width={"thin"} as={Menu} vertical visible={true} inverted icon="labeled">
        <Menu.Item header as={Link} to="/">
          <Icon name="home" />
        </Menu.Item>

        {organizations.map((org, index) => {
          return (
            <Menu.Item key={index} as={Link} to={{ pathname: `/dao/${org.address}`}}>
              <Menu.Header>{org.name}</Menu.Header>
            </Menu.Item>
          )
        })}
        
        <Menu.Item as={Link} to="/dao/create">
          <Icon name="add square" />
        </Menu.Item>
      </Sidebar>
    )
  }
}
