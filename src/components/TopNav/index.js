import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Menu, Segment, Button, Container, Dropdown } from 'semantic-ui-react';

import { PropTypes } from 'prop-types';

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

        const daoOptions = [
          {key: 1, text: 'Create DAO', value: 1}
        ];

        const pollOptions = [
          {key: 1, text: 'Create poll', value: 1},
          {key: 1, text: 'Create vote', value: 1}
        ];

        return (
            <Segment color='teal' size='small' inverted>
                <Container>
                    <Menu size='large' color='teal' inverted secondary borderless>
                        <Menu.Item name='home' to='/' active={activeItem === 'home'} as={ Link }  onClick={this.handleItemClick} header style={{ fontSize: '18px' }}>GENTO</Menu.Item>
                        <Menu.Menu position='right'>

                          {/* <Menu.Item compact >
                            <Dropdown text='ICO' simple item>
                                <Dropdown.Menu>
                                  <Dropdown.Item text='Create ICO' />
                                  <Dropdown.Item text='Create DAO' />
                                </Dropdown.Menu>
                            </Dropdown>
                          </Menu.Item>

                          <Menu.Item compact>
                            <Dropdown text='DAO' options={daoOptions} simple item />
                          </Menu.Item>

                          <Menu.Item compact>
                            <Dropdown text='POLL' options={pollOptions} simple item />
                          </Menu.Item> */}

                        <Menu.Item name='list' to='/list' active={activeItem === 'list'} as={ Link }  onClick={this.handleItemClick} header style={{ fontSize: '18px' }}>ICO</Menu.Item>
                        <Menu.Item name='ico' to='/poll' active={activeItem === 'poll'} as={ Link }  onClick={this.handleItemClick} header style={{ fontSize: '18px' }}>POLL</Menu.Item>                        

                          {this.props.account && <Menu.Item><Button inverted color='teal'>Account: {this.hideAccountHash()}</Button></Menu.Item>}
                        </Menu.Menu>
                    </Menu>
                </Container>
            </Segment>
        )
    }
}
export default TopNav;
