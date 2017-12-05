import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from 'pages/About';
import List from 'pages/List';
import GenerateDAO from 'pages/GenerateDAO';
import GeneratePoll from 'pages/GeneratePoll';
import Ico from 'pages/Ico';
import Dao from 'pages/Dao';
import DaoList from 'pages/DaoList';
import Poll from 'pages/Poll';
import Error from 'pages/Error';
import DaoSettings from 'pages/DaoSettings';

const Routes = ({ account, network, notify, active, handleShow, handleHide, contextRef, createDAO }) => (
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
        <Route path="/dao/:address"
            render={(props) => (<Dao
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
        <Route path="/daoList"

            render={(props) => (<DaoList
                                    {...props}
                                    account={account}
                                    notify={notify}
                                />)}
        />
        <Route path="/daoSettings/:address"
            render={(props) => (<DaoSettings
                                    {...props}
                                    account={account}
                                    notify={notify}
                                />)}
        />
        <Route path="/generate"
            render={(props) => (<GenerateDAO
                                    {...props}
                                    account={account}
                                    network={network}
                                    notify={notify}
                                    active={active}
                                    handleShow={handleShow}
                                    handleHide={handleHide}
                                    createDAO={createDAO}
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
                                    setCurrPoll={setCurrPoll}
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
                                    getCurrDao={getCurrDao}
                                    currPoll={currPoll}
                                />)}
        />
        <Route component={Error} />
    </Switch>
)

export default Routes;