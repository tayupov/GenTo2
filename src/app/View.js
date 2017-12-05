import React from 'react';
import { Container } from 'semantic-ui-react';

import TopNav from 'components/TopNav';
import SideBar from 'components/SideBar';
import Routes from './Routes';

const View = ({
    account, network, notify, active, handleShow, handleHide, setCurrDao, getCurrDao, contextRef, daos, currDao, currPoll, setCurrPoll
}) => (
    <div>
        <TopNav account={account} />
        <SideBar />
        <Container style={{ paddingLeft: '8em' }}>
            <Routes
                account={account}
                network={network}
                notify={notify}
                active={active}
                handleShow={handleShow}
                handleHide={handleHide}
                getCurrDao={getCurrDao}
                setCurrPoll={setCurrPoll}
                currPoll={currPoll}
                contextRef={contextRef}
                daos={daos}
            />
        </Container>
    </div>
)

export default View;
