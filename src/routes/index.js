import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';

import DAO from './DAO';
import DAOList from './DAOList';
import DAOCreator from './DAOCreator';
import DAOSettings from './DAOSettings';

import DAOVotings from './DAOVotings';

import GeneratePoll from './GeneratePoll';


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
                <Route exact path="/" component={Home} />

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

                <Route path="/dao/:address/votings/create"
                    render={(props) => (
                        <GeneratePoll
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

                <Route component={NotFound} />

            </Switch>
        )
    }
}