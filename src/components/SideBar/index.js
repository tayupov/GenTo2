import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';

import './index.css';

class SideBar extends Component {
    state = {}

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });
        this.props.setCurrDao(name);
        console.log(this.props.icos);
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
                                        to={`/dao/${dao.daoName}`}
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
                            <Menu.Item style={{ paddingLeft: '3em' }} as={Link} to='/generate'>
                                <Button color='teal'>
                                    Create a DAO
                                </Button>
                            </Menu.Item>
                            <Menu.Item>
                                <h2 style={{ textAlign: 'center', fontWeight: '500' }}>Your ICOs</h2>
                            <Menu.Menu style={{ marginTop: '2em' }}>
                                {this.props.icos.map(ico => (
                                     <Menu.Item
                                        name={ico.name}
                                        to={`/ico/${ico.address}`}
                                        active={activeItem === ico.name}
                                        as={ Link }
                                        onClick={this.handleItemClick}
                                        header
                                        style={{ fontSize: '18px', fontWeight: '100', textAlign: 'center' }}
                                    >
                                        {ico.name.substring(0, 3).toUpperCase()}
                                    </Menu.Item>
                                ))}
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