import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment, Button, Container, Dropdown } from 'semantic-ui-react';

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
        return (
            <Segment color='teal' size='small' inverted>
                <Container>
                    <Menu size='large' color='teal' inverted secondary borderless>
                        <Menu.Menu style={{ paddingLeft: '3em' }} position='left'>
                            <Menu.Item header>CURRENT DAO : <span style={{ letterSpacing: '0.05em', paddingLeft: '0.5em' }}>DIGIX</span></Menu.Item>
                        </Menu.Menu>
                        <Menu.Menu position='right'>

                          <Menu.Item>
                            <Dropdown text='DAO'>
                                <Dropdown.Menu style={ styles.dropDownMenu }>
                                  <Dropdown.Item as={Link} text='Create a DAO' to='/generate' />
                                  <Dropdown.Item as={Link} to='/daoList' text='List all DAOs' />
                                  <Dropdown.Item as={Link} text='List all ICOs' to='/list' />
                                </Dropdown.Menu>
                            </Dropdown>
                          </Menu.Item>

                          <Menu.Item>
                            <Dropdown text='Voting'>
                                <Dropdown.Menu style={ styles.dropDownMenu }>
                                  <Dropdown.Item as={Link} text='Create a Voting' to="/generatePoll" />
                                  <Dropdown.Item as={Link} text='List all votings' to='/poll' />
                                </Dropdown.Menu>
                            </Dropdown>
                          </Menu.Item>
                        {!this.props.account && <Menu.Item><Button inverted color='teal'>Account: Please Log in through MetaMask!</Button></Menu.Item>}
                        {this.props.account && <Menu.Item><Button inverted color='teal'>Account: {this.hideAccountHash()}</Button></Menu.Item>}
                        </Menu.Menu>
                    </Menu>
                </Container>
            </Segment>
        )
    }
}
export default TopNav;
