import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Menu, Segment } from 'semantic-ui-react';

class TopNav extends Component {

    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state

        return (
            <Segment color='teal' size='small' inverted>
                <Menu size='large' color='teal' inverted secondary borderless>
                    <Menu.Item header style={{ fontSize: '18px' }}>GENTO</Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item name='about' as={ Link } to='/' active={activeItem === 'about'} onClick={this.handleItemClick} />
                        <Menu.Item name='generate' as={ Link } to='/generate' active={activeItem === 'generate'} onClick={this.handleItemClick} />
                        <Menu.Item name='list' as={ Link } to='/list' active={activeItem === 'list'} onClick={this.handleItemClick} />
                    </Menu.Menu>                                
                </Menu>
            </Segment>
        )
    }
}

export default TopNav;


