import React from 'react';

import { Header, Icon } from 'semantic-ui-react';

const HeaderSection = () => (
    <Header className='flex-center' style={{ flexDirection: 'column', fontSize: '35px', marginTop: '1em', textAlign: 'center' }}>
        <Icon name='info' />
            Contract Details
        <Header.Subheader style={{ marginTop: '1em', fontSize: '18px' }}>
            This page can be used to view a contract's details. 
            Please have a look on the explanations below to get in touch with 
            the contract and its characteristics.
        </Header.Subheader>
    </Header>
)

export default HeaderSection;