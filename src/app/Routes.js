import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from 'pages/About';
import List from 'pages/List';
import GenerateICO from 'pages/GenerateICO';
import GeneratePoll from 'pages/GeneratePoll';
import Ico from 'pages/Ico';
import Dao from 'pages/Dao';
<<<<<<< ff20625797572dedc9ef6956d11553fb7702199c
import DaoSettings from 'pages/DaoSettings';
import DaoList from 'pages/DaoList';
=======
>>>>>>> Adjust the layout
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
        <Route path="/dao/:address"
            render={(props) => (<Dao
                                    {...props}
                                    account={account}
                                    network={network}
<<<<<<< ff20625797572dedc9ef6956d11553fb7702199c
                                    notify={notify}
                                />)}
        />
        <Route path="/daoSettings/:address"
            render={(props) => (<DaoSettings
                                    {...props}
                                    account={account}
                                    network={network}
                                    notify={notify}
                                />)}
        />
        <Route path="/icoList"
=======
                                    notify={notify}  
                                />)}
        />
        <Route path="/list"
>>>>>>> Adjust the layout
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