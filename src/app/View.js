import React from 'react';
import { Container } from 'semantic-ui-react';

import TopNav from 'components/TopNav';
import SideBar from 'components/SideBar';
import Routes from './Routes';

const View = ({
    account, network, notify, active, handleShow, handleHide, setCurrDao, icos, getCurrDao, setIcos, contextRef, daos, createDAO, currDao, currPoll, setCurrPoll, addDemoDao
}) => (
    <div>
        <TopNav
            account={account}
            getCurrDao={getCurrDao}
        />
        <SideBar
            daos={daos}
            icos={icos}
            setCurrDao={setCurrDao}
        />
        <Container style={{ paddingLeft: '8em' }}>
            <Routes
                account={account}
                network={network}
                notify={notify}
                active={active}
                handleShow={handleShow}
                handleHide={handleHide}
                createDAO={createDAO}
                getCurrDao={getCurrDao}
                setCurrPoll={setCurrPoll}
                currPoll={currPoll}
                contextRef={contextRef}
                daos={daos}
                setIcos={setIcos}
                addDemoDao={addDemoDao}
            />
        </Container>
    </div>
)

export default View;
