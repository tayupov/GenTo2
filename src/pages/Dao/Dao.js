import React from 'react';

import { Container } from 'semantic-ui-react';

import HeaderSection from './components/HeaderSection';
import DetailsSection from './components/DetailsSection';
import TokenSection from './components/TokenSection';

const Dao = ({
    auctionDetailsParsed
}) => (
    <Container style={{ width: '800px' }}>
        <HeaderSection />
        <DetailsSection
            details={auctionDetailsParsed}
        />
    </Container>
)

export default Dao;