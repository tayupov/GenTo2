import React from 'react';

import { Link } from 'react-router-dom';
import { Header, Icon, Container, Button } from 'semantic-ui-react';

const HeaderSection  = () => (<Header >


        <Button  as={Link} to='/poll' color='teal'>
            Go to votings
        </Button>
        <Button  as={Link} to='/daoSettings/EBikeEnterprises' color='teal' style={{ float: 'right' }}>
            <Icon name='setting' />
            Settings
        </Button>
        <h1 style={{textAlign: 'center' }}>Dao Details</h1>
        <Header.Subheader style={{ marginTop: '1em', fontSize: '18px',textAlign: 'center' }}>
            This page can be used to view a dao's details. 
            Please have a look on the explanations below to get in touch with 
            the contract and its characteristics.
        </Header.Subheader>
    </Header>
)

export default HeaderSection;