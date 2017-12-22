import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from './About';
import DAOCreator from './DAOCreator';
import DaoSettings from './DaoSettings';
import Votings from './Votings';
import DAO from './DAO';

import GeneratePoll from './GeneratePoll';
import DaoList from './DaoList';
import Error from './Error';

/*
    Bear in mind that the order of <Route /> components inside a <Switch /> component
    determines which component will be rendered first. 
    (e.g. /dao/:address/vote matches before dao/:address)
*/
export default class Routes extends React.Component {
    render() {
        const { account, network, notify } = this.props;
        return (
            <Switch>
                <Route exact path="/" component={About} />
                <Route path="/dao/create"
                    render={(props) => (
                        <DAOCreator
                            account={account}
                            network={network}
                            notify={notify}
                            />
                    )}
                    />
                <Route path="/dao/:address/settings"
                    render={(props) => (<DaoSettings
                        account={account}
                        notify={notify}
                        />)}
                    />
                <Route path="/dao/:address/votings"
                    render={(props) => (<Votings
                        account={account}
                        address={props.match.params.address}
                        network={network}
                        notify={notify}
                        />)}
                    />

                <Route path="/dao/:address"
                    render={(props) => (<DAO
                        account={account}
                        address={props.match.params.address}
                        network={network}
                        notify={notify}
                        />)}
                    />

                <Route component={Error} />

                {/* Is everything below this really needed? */}
                <Route path="/daoList"
                    render={(props) => (<DaoList
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
            </Switch>
        )
    }
}