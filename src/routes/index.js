import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';

import Organisation from './Organisation';
import DAOList from './DAOList';
import DAOCreator from './DAOCreator';

import ProposalCreator from './ProposalCreator';
import ProposalList from './ProposalList';
import Proposal from './Proposal';


/*
    Bear in mind that the order of <Route /> components inside a <Switch /> component
    determines which component will be rendered first. 
    (e.g. /dao/:address/proposals matches before dao/:address, order specific routes first)
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
                        <ProposalCreator
                            account={account}
                            network={network}
                            address={props.match.params.address}
                            notify={notify}
                        />
                    )}
                />

                <Route path="/dao/:address/proposals/:proposalNumber"
                    render={(props) => (
                        <Proposal
                            account={account}
                            network={network}
                            address={props.match.params.address}
                            proposalNumber={props.match.params.proposalNumber}
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

                <Route path="/dao/:address"
                    render={(props) => (
                        <Organisation
                            key={props.match.params.address}
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