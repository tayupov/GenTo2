import React from 'react';

import { Grid, Sticky } from 'semantic-ui-react';

import PollList from './components/PollList';
import PollDetails from './components/PollDetails';

const Poll = ({
    header, onClick, handleOpen, polls, contextRef
}) => (
    <Grid columns={2}>
        <Grid.Column width={10}>
            <PollList 
                onClick={onClick}
                handleOpen={handleOpen}
                polls={polls}
            />
        </Grid.Column>
        <Grid.Column width={6}>
            <Sticky context={contextRef}>
                <PollDetails header={header} />
            </Sticky>
        </Grid.Column>
    </Grid>
)

export default Poll;