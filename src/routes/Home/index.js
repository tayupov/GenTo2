import React from 'react';
import Header from 'components/Header';
import { Container } from 'semantic-ui-react';

export default () => (
    <Container text>
        <Header text='ABOUT GENTO' id='header' />
        <p>
            PLEASE LOGIN THROUGH METAMASK.
        </p>
        <p>
            Hallo Christian, bitte mach irgendwas aus dieser Komponente, ich dachte an einen Dimmer oder so.
            Beweg sie auch aus src/routes nach components/ bitte
        </p>
    </Container>
)
