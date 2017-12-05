import React from 'react';

import { Grid, Sticky } from 'semantic-ui-react';

import PollList from './components/PollList';
import SearchNav from './components/PollList/components/SearchNav';
import PollDetails from './components/PollDetails';

const Poll = ({
    header, onClick, handleOpen, polls, contextRef
}) => (
    <Grid columns={2}>
        <Grid.Column width={6}>
            {polls && <Sticky context={contextRef}>
                <PollDetails
                    header={header}
                    polls={polls}
                />
            </Sticky>}
        </Grid.Column>
        <Grid.Column width={10}>
            <SearchNav />
            <PollList 
                onClick={onClick}
                handleOpen={handleOpen}
                polls={polls}
            />
        </Grid.Column>
    </Grid>
)

export default Poll;