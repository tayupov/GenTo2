import React from 'react';

import { Grid } from 'semantic-ui-react';

import PollList from './components/PollList';
import PollDetails from './components/PollDetails';

const Poll = ({
    header, onClick
}) => (
    <Grid columns={2}>
        <Grid.Column width={10}>
            <PollList onClick={onClick} />
        </Grid.Column>
        <Grid.Column width={6}>
            <PollDetails header={header} />
        </Grid.Column>
    </Grid>
)

export default Poll;