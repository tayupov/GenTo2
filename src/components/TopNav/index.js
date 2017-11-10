import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Menu, Segment, Button, Container } from 'semantic-ui-react';

import { PropTypes } from 'prop-types';

class TopNav extends Component {

    state = {
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state

        return (
            <Segment color='teal' size='small' inverted>
                <Container>
                    <Menu size='large' color='teal' inverted secondary borderless>
                        <Menu.Item name='home' to='/' active={activeItem === 'home'} as={ Link }  onClick={this.handleItemClick} header style={{ fontSize: '18px' }}>GENTO</Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item><Button inverted color="teal">{this.props.account}</Button></Menu.Item>
                            <Menu.Item name='generate' as={ Link } to='/generate' active={activeItem === 'generate'} onClick={this.handleItemClick} />
                            <Menu.Item name='list' as={ Link } to='/list' active={activeItem === 'list'} onClick={this.handleItemClick} />
                        </Menu.Menu>
                    </Menu>
                </Container>
            </Segment>
        )
    }
}
export default TopNav;
