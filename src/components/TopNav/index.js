import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Menu, Segment, Button, Container, Dropdown } from 'semantic-ui-react';

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

        const icoOptions = [
          {key: 1, text: 'Create ICO', value: 1}
        ];

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

                          <Menu.Item compact >
                            <Dropdown text='ICO' options={icoOptions} simple item />
                          </Menu.Item>

                          <Menu.Item compact>
                            <Dropdown text='DAO' options={daoOptions} simple item />
                          </Menu.Item>

                          <Menu.Item compact>
                            <Dropdown text='POLL' options={pollOptions} simple item />
                          </Menu.Item>

                          {console.log(this.props.account)}

                          <Menu.Item><Button inverted color='teal'>Account: {this.props.account}</Button></Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </Container>
            </Segment>
        )
    }
}
export default TopNav;

/*<Menu.Item name='generate-ico' class='ui compact menu' as={ Link } to='/list' active={activeItem === 'list'} onClick={this.handleItemClick} >
  <div class='ui simple dropdown item'>ICO <i class='dropdown icon'></i>
    <div class='menu'>
      <div name='generate' class='item' as={ Link } to='/generate' active={activeItem === 'generate'} onClick={this.handleItemClick}>Create ICO</div>
    </div>
  </div>
</Menu.Item>

<Menu.Item name='generate-dao' class='ui compact menu' as={ Link } to='/generate' active={activeItem === 'generate'} onClick={this.handleItemClick} >
  <div class='ui simple dropdown item'>DAO <i class='dropdown icon'></i>
    <div class='menu'>
      <div name='dao' class='item' as={Link} to='/dao' active={activeItem === 'dao'} onClick={this.handleItemClick}>Create DAO</div>
    </div>
  </div>
</Menu.Item>

<Menu.Item name='poll'  class='ui compact menu' as={ Link } to='/poll' active={activeItem === 'poll'} onClick={this.handleItemClick} >
  <div class='ui simple dropdown item'>Poll <i class='dropdown icon'></i>
    <div class='menu'>
      <div name='poll' class='item' as={Link} to='/poll' active={activeItem === 'poll'} onClick={this.handleItemClick}>Create a poll</div>
      <div name='vote' class='item' to='/vote' active={activeItem === 'vote'} onClick={this.handleItemClick}>Create a vote</div>
    </div>
  </div>
</Menu.Item> */
