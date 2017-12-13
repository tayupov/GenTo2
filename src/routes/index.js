import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from './About';
import List from './List';
import GenerateDAO from './GenerateDAO';
import GeneratePoll from './GeneratePoll';
import Ico from './Ico';
import Dao from './Dao';
import DaoList from './DaoList';
import Poll from './Poll';
import Error from './Error';
import DaoSettings from './DaoSettings';


const Routes = ({ account, network, notify, active, handleShow, handleHide, getCurrDao, contextRef, setIcos, createDAO, daos, setCurrPoll, currPoll, addDemoDao }) => (
    <Switch>
        <Route exact path="/"
            render={(props) => (<About {...props} />)}
        />
        <Route path="/ico/:address"
            render={(props) => (<Ico
                                    {...props}
                                    account={account}
                                    key={props.match.params.address}
                                    network={network}
                                    notify={notify}
                                    addDemoDao={addDemoDao}
                                />)}
        />
        <Route path="/dao/:address"
            render={(props) => (<Dao
                                    {...props}
                                    account={account}
                                    key={props.match.params.address}
                                    getCurrDao={getCurrDao}
                                    network={network}
                                    notify={notify}
                                />)}
        />
        <Route path="/list"
            render={(props) => (<List
                                    {...props}
                                    account={account}
                                    notify={notify}
                                    setIcos={setIcos}
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