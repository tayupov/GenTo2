import React from 'react';

import { Container } from 'semantic-ui-react';

import TopNav from 'components/TopNav';

import Routes from './Routes';

const View = ({
    account, network, notify
}) => (
    <div>
        <TopNav account={account} />
        <Container>
            <Routes
                account={account}
                network={network}
                notify={notify}
            />
        </Container>
    </div>
)

export default View;
