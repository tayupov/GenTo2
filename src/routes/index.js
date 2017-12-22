import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from './About';
import DAO from './DAO';
import DAOList from './DAOList';
import DAOCreator from './DAOCreator';
import DAOSettings from './DAOSettings';

import DAOVotings from './DAOVotings';

import GeneratePoll from './GeneratePoll';
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

                <Route path="/dao/list"
                    render={(props) => (
                        <DAOList
                            account={account}
                            notify={notify}
                            />
                    )}
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

                <Route path="/dao/:address/settings"
                    render={(props) => (
                        <DAOSettings
                            account={account}
                            address={props.match.params.address}
                            notify={notify}
                            />)}
                    />
                <Route path="/dao/:address/votings"
                    render={(props) => (
                        <DAOVotings
                            account={account}
                            address={props.match.params.address}
                            network={network}
                            notify={notify}
                            />
                    )}
                    />

                <Route path="/dao/:address"
                    render={(props) => (
                        <DAO
                            account={account}
                            address={props.match.params.address}
                            network={network}
                            notify={notify}
                            />
                    )}
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