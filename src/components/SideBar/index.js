import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';

export default class SideBar extends Component {

  render() {
    const organizations = this.props.organizations;
    return (
      <Menu vertical borderless>
        <Menu.Item header color={"green"} as ={Link} to="/">
          GenTo
        </Menu.Item>
        {organizations.map((org, index) => {
          return (
            <Menu.Item>
              {org.name}
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
}
