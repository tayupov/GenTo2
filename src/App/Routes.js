import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from 'pages/About';
import List from 'pages/List';
import GenerateICO from 'pages/GenerateICO';
import Ico from 'pages/Ico';
import Error from 'pages/Error';


const Routes = ({ account, network, notify, active, handleShow, handleHide }) => (
    <Switch>
        <Route exact path="/"
            render={(props) => (<About {...props} />)}
        />
        <Route path="/ico/:address"
            render={(props) => (<Ico
                                    {...props}
                                    account={account}
                                    network={network}
                                    notify={notify} 
                                />)}
        />
        <Route path="/list"
            render={(props) => (<List
                                    {...props}
                                    account={account}
                                    notify={notify} 
                                />)}
        />
        <Route path="/generate"
            render={(props) => (<GenerateICO
                                    {...props}
                                    account={account}
                                    network={network}
                                    notify={notify}
                                    active={active}
                                    handleShow={handleShow}
                                    handleHide={handleHide}
                                />)}
        />
        <Route component={Error} />
    </Switch>
)

export default Routes;