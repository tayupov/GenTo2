import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import { Dropdown, Icon, Input, Menu, Divider } from 'semantic-ui-react';

import './index.css';

class SideBar extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })


    componentDidMount() {}

    render() {
        const { activeItem } = this.state

        return(
            <div className='pusher'>
                <div className='full height'>
                    <div className='toc'>
                        <Menu className='vertical left fixed'>              
                            <Menu.Menu style={{ background: '#00b5ad', height: '72.5px' }}>
                                <Menu.Item
                                    name='home'
                                    to='/'
                                    active={activeItem === 'home'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '28px', color: 'white', textAlign: 'center', height: '72.5px', paddingTop: '0.7em' }}
                                >
                                    GENTO
                                </Menu.Item>
                            </Menu.Menu>
                            <Menu.Item>
                                <h2 style={{ textAlign: 'center', fontWeight: '500' }}>Your DAOs</h2>
                                
                            <Menu.Menu style={{ marginTop: '2em' }}>
                                <Menu.Item
                                    name='dao'
                                    to='/'
                                    active={activeItem === 'dao'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    DAO
                                </Menu.Item>
                                <Menu.Item
                                    name='roi'
                                    to='/'
                                    active={activeItem === 'roi'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    ROI
                                </Menu.Item>
                                <Menu.Item
                                    name='lao'
                                    to='/'
                                    active={activeItem === 'lao'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    LAO
                                </Menu.Item>
                                <Menu.Item
                                    name='ova'
                                    to='/'
                                    active={activeItem === 'ova'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    OVA
                                </Menu.Item>
                            </Menu.Menu>
                            </Menu.Item>
                            <Menu.Item>
                                <h2 style={{ textAlign: 'center', fontWeight: '500' }}>Your ICOs</h2>
                                
                            <Menu.Menu style={{ marginTop: '2em' }}>
                                <Menu.Item
                                    name='MUL'
                                    to='/'
                                    active={activeItem === 'MUL'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    MUL
                                </Menu.Item>
                                <Menu.Item
                                    name='LUC'
                                    to='/'
                                    active={activeItem === 'LUC'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    LUC
                                </Menu.Item>
                                <Menu.Item
                                    name='WIN'
                                    to='/'
                                    active={activeItem === 'WIN'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    WIN
                                </Menu.Item>
                                <Menu.Item
                                    name='MOK'
                                    to='/'
                                    active={activeItem === 'MOK'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    MOK
                                </Menu.Item>
                            </Menu.Menu>
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </div>
        )
    }
}

export default SideBar;