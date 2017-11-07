import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Container } from 'semantic-ui-react';

import About from 'pages/About';
import List from 'pages/List';
import GenerateICO from 'pages/GenerateICO';
import Ico from 'pages/Ico';

import TopNav from 'components/TopNav';

const View = ({
    account, network
}) => (
    <div>
        <TopNav />
        <Container style={{ width: '800px' }}>
            <Switch>
                <Route exact path="/"
                    render={(props) => (<About {...props} account={account} network={network} />)}
                />
                <Route path="/ico/:address"
                    render={(props) => (<Ico {...props} account={account} network={network} />)}
                />
                <Route path="/list"
                    render={(props) => (<List {...props} account={account} />)}
                />
                <Route path="/generate"
                    render={(props) => (<GenerateICO {...props} account={account} />)}
                />
            </Switch>
        </Container>
    </div>
)

export default View;