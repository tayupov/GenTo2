import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Menu, Segment, Button } from 'semantic-ui-react';

import { PropTypes } from 'prop-types';

class TopNav extends Component {

    state = {
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state

        return (
            <Segment color='teal' size='small' inverted>
                <Menu size='large' color='teal' inverted secondary borderless>
                    <Menu.Item name='home' to='/' active={activeItem === 'home'} as={ Link }  onClick={this.handleItemClick} header style={{ fontSize: '18px' }}>GENTO</Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item name='generate' as={ Link } to='/generate' active={activeItem === 'generate'} onClick={this.handleItemClick} />
                        <Menu.Item name='list' as={ Link } to='/list' active={activeItem === 'list'} onClick={this.handleItemClick} />
                        <Menu.Item><Button inverted color="teal">{this.props.account}</Button></Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Segment>
        )
    }
}

TopNav.propTypes = {
    account: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired
}
export default TopNav;
