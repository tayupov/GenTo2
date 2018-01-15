import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';

import DAO from './DAO';
import DAOList from './DAOList';
import DAOCreator from './DAOCreator';
import DAOSettings from './DAOSettings';

import DAOVotings from './DAOVotings';
import DAOVotingsCreator from './DAOVotingsCreator';
import ProposalList from './ProposalList';
import Proposal from './Proposal';


/*
    Bear in mind that the order of <Route /> components inside a <Switch /> component
    determines which component will be rendered first. 
    (e.g. /dao/:address/votings matches before dao/:address, order specific routes first)
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

                <Route path="/dao/:address/proposals/create"
                    render={(props) => (
                        <DAOVotingsCreator
                            account={account}
                            network={network}
                            address={props.match.params.address}
                            notify={notify}
                        />
                    )}
                />

                <Route path="/dao/:address/proposals/:proposal"
                    render={(props) => (
                        <Proposal
                            account={account}
                            network={network}
                            address={props.match.params.address}
                            proposal={props.match.params.proposal}
                            notify={notify}
                        />
                    )}
                />

                <Route path="/dao/:address/proposals"
                    render={(props) => (
                        <ProposalList
                            account={account}
                            network={network}
                            address={props.match.params.address}
                            notify={notify}
                        />
                    )}
                />

                <Route path="/dao/:address/settings"
                    render={(props) => (
                        <DAOSettings
                            account={account}
                            network={network}
                            address={props.match.params.address}
                            notify={notify}
                        />)}
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