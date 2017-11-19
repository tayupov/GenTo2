import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { Menu, Segment, Button, Container, Dropdown } from 'semantic-ui-react';

import { PropTypes } from 'prop-types';

const styles = {
    dropDownMenu: {
        marginTop: '1em',
    }
}

class TopNav extends Component {

    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    hideAccountHash = () => {
      const accountHash = this.props.account;
      const firstTenSigns = accountHash.replace(accountHash.substring(10,accountHash.length-1), '***');
      return firstTenSigns;
    };

    render() {
        const { activeItem } = this.state;

        return (
            <Segment color='teal' size='small' inverted>
                <Container>
                    <Menu size='large' color='teal' inverted secondary borderless>
                        <Menu.Item name='home' to='/' active={activeItem === 'home'} as={ Link }  onClick={this.handleItemClick} header style={{ fontSize: '18px' }}>GENTO</Menu.Item>
                        <Menu.Menu position='right'>

                          <Menu.Item>
                            <Dropdown text='ICO'>
                                <Dropdown.Menu style={ styles.dropDownMenu }>
                                  <Dropdown.Item as={Link} text='Create an ICO' to='/generate' />
                                  <Dropdown.Item as={Link} text='List all ICOs' to='/list' />
                                </Dropdown.Menu>
                            </Dropdown>
                          </Menu.Item>

                          <Menu.Item>
                            <Dropdown text='DAO'>
                                <Dropdown.Menu style={ styles.dropDownMenu }>
                                  <Dropdown.Item text='Create a DAO' />
                                  <Dropdown.Item text='List all DAOs' />
                                </Dropdown.Menu>
                            </Dropdown>
                          </Menu.Item>

                          <Menu.Item>
                            <Dropdown text='Voting'>
                                <Dropdown.Menu style={ styles.dropDownMenu }>
                                  <Dropdown.Item text='Create a Voting' as={Link} to="/generatePoll" />
                                  <Dropdown.Item as={Link} text='List all votings' to='/poll' />
                                </Dropdown.Menu>
                            </Dropdown>
                          </Menu.Item>
                        {this.props.account && <Menu.Item><Button inverted color='teal'>Account: {this.hideAccountHash()}</Button></Menu.Item>}
                        </Menu.Menu>
                    </Menu>
                </Container>
            </Segment>
        )
    }
}
export default TopNav;
