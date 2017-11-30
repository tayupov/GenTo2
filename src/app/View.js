import React from 'react';
import { Container } from 'semantic-ui-react';

import TopNav from 'components/TopNav';
import SideBar from 'components/SideBar';
import Routes from './Routes';

const View = ({
    account, network, notify, active, handleShow, handleHide, contextRef
}) => (
    <div>
        <TopNav account={account} />
        <SideBar />
        <Container>
            <Routes
                account={account}
                network={network}
                notify={notify}
                active={active}
                handleShow={handleShow}
                handleHide={handleHide}
                contextRef={contextRef}
            />
        </Container>
    </div>
)

export default View;
