import React from 'react';

import { Container } from 'semantic-ui-react';

import HeaderSection from './components/HeaderSection';
import DetailsSection from './components/DetailsSection';

const Dao = ({
    daoDetailsParsed, notify
}) => (
    <Container style={{ width: '800px' }}>
        <HeaderSection />
        {daoDetailsParsed &&
        <DetailsSection
            details={daoDetailsParsed}
            notify={notify}
        />}
    </Container>
)

export default Dao;