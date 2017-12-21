import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from './About';
import List from './List';
import DAOCreator from './DAOCreator';
import GeneratePoll from './GeneratePoll';
import Ico from './Ico';
import Dao from './Dao';
import DaoList from './DaoList';
import Vote from './Vote';
import Error from './Error';
import DaoSettings from './DaoSettings';

export default class Routes extends React.Component {
    render() {
        const { account, network, notify } = this.props;
        return (
            <Switch>
                <Route exact path="/"
                    render={(props) => (<About {...props} />)}
                    />
                <Route path="/dao/create"
                    render={(props) => (
                        <DAOCreator
                            account={account}
                            network={network}
                            notify={notify}
                            />
                    )}
                    />
                <Route path="/dao/:address"
                    render={(props) => (<Dao
                        account={account}
                        key={props.match.params.address}
                        network={network}
                        notify={notify}
                        />)}
                    />
                <Route path="/dao/:address/vote"
                    render={(props) => (<Vote
                        account={account}
                        key={props.match.params.address}
                        network={network}
                        notify={notify}
                        />)}
                    />
                <Route path="/list"
                    render={(props) => (<List
                        account={account}
                        notify={notify}
                        />)}
                    />
                <Route path="/daoList"
                    render={(props) => (<DaoList
                        account={account}
                        notify={notify}
                        />)}
                    />
                <Route path="/daoSettings/:address"
                    render={(props) => (<DaoSettings
                        account={account}
                        notify={notify}
                        />)}
                    />

                <Route path="/generatePoll"
                    render={(props) => (<GeneratePoll
                        account={account}
                        network={network}
                        notify={notify}
                        />)}
                    />
                <Route component={Error} />
            </Switch>
        )
    }
}