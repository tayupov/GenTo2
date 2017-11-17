import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Menu, Segment, Button, Container } from 'semantic-ui-react';

import { PropTypes } from 'prop-types';

class TopNav extends Component {

    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    hideAccountHash = () => {
      var accountHash = this.props.account;
      console.log('str: ' + accountHash);
      var firstTenSigns = accountHash.replace(accountHash.substring(10,accountHash.length-1), '*');
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
                            <Menu.Item name='generate' class='ui compact menu' as={ Link } to='/generate' active={activeItem === 'generate'} onClick={this.handleItemClick} >
                              <div class='ui simple dropdown item'>Generate <i class='dropdown icon'></i>
                                <div class='menu'>
                                  <div class='item'>Create ICO</div>
                                  <div class='item'>Create DAO</div>
                                </div>
                              </div>
                            </Menu.Item>
                            <Menu.Item name='poll'  class='ui compact menu' as={ Link } to='/poll' active={activeItem === 'poll'} onClick={this.handleItemClick} >
                              <div class='ui simple dropdown item'>Poll <i class='dropdown icon'></i>
                                <div class='menu'>
                                  <div class='item'>Create a poll</div>
                                  <div class='item'>Create a vote</div>
                                </div>
                              </div>
                            </Menu.Item>
                            <Menu.Item name='list' as={ Link } to='/list' active={activeItem === 'list'} onClick={this.handleItemClick} />
                            {console.log(this.props.account)}
                            <Menu.Item>
                              Account:
                            </Menu.Item>
                            <Menu.Item><Button inverted color='teal' /*style={{color: red}}*/>{this.props.account}</Button></Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </Container>
            </Segment>
        )
    }
}
export default TopNav;
