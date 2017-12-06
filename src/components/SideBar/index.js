import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';

import './index.css';

class SideBar extends Component {
    state = {}

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });
        this.props.setCurrDao(name);
    }

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
                                {this.props.daos.map(dao => (
                                     <Menu.Item
                                        name={dao.daoName}
                                        to={`dao/${dao.daoName}`}
                                        active={activeItem === dao.daoName}
                                        as={ Link }
                                        onClick={this.handleItemClick}
                                        header
                                        style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                    >
                                        {dao.daoName}
                                    </Menu.Item>
                                ))}
                            </Menu.Menu>
                            </Menu.Item>
                            <Menu.Item style={{ paddingLeft: '3em' }}>
                                <Button color='teal'>
                                    Create a DAO
                                </Button>
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
                                <Menu.Item
                                    name='MOK'
                                    to='/'
                                    active={activeItem === 'MOK'}
                                    as={ Link }
                                    onClick={this.handleItemClick}
                                    header
                                    style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                >
                                    TUI
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
                                    LIM
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