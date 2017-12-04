import React from 'react';

import { Link } from 'react-router-dom';
import { Header, Icon, Container, Button } from 'semantic-ui-react';

const HeaderSection  = () => (<Header >
        <Container  textAlign="right">
            <Button  as={Link}  to={`/daoSettings/8`}  > <Icon name='settings'/> </Button>
            <Button  as={Link} to='/poll' >
                Go to votings
            </Button>
        </Container>

        <h1 style={{textAlign: 'center' }}>Dao Details</h1>
        <Header.Subheader style={{ marginTop: '1em', fontSize: '18px',textAlign: 'center' }}>
            This page can be used to view a dao's details. 
            Please have a look on the explanations below to get in touch with 
            the contract and its characteristics.
        </Header.Subheader>
    </Header>
)

export default HeaderSection;