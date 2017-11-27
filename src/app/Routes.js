import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from 'pages/About';
import List from 'pages/List';
import GenerateICO from 'pages/GenerateICO';
import GeneratePoll from 'pages/GeneratePoll';
import Ico from 'pages/Ico';
import Poll from 'pages/Poll';
import Error from 'pages/Error';


const Routes = ({ account, network, notify, active, handleShow, handleHide, contextRef }) => (
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
        <Route path="/generatePoll"
               render={(props) => (<GeneratePoll
                                {...props}
                                account={account}
                                network={network}
                                notify={notify}
                                active={active}
                                handleShow={handleShow}
                                handleHide={handleHide}
                            />)}
        />
        <Route path="/poll"
            render={(props) => (<Poll
                                    {...props}
                                    account={account}
                                    network={network}
                                    notify={notify}
                                    active={active}
                                    contextRef={contextRef}
                                />)}
        />
        <Route component={Error} />
    </Switch>
)

export default Routes;