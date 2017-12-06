import React from 'react';

import { Grid, Sticky } from 'semantic-ui-react';

import PollList from './components/PollList';
import SearchNav from './components/PollList/components/SearchNav';
import PollDetails from './components/PollDetails';

const Poll = ({
    header, onClick, handleOpen, handleReset, polls, contextRef, account, currDaoDetails
}) => (
    <Grid columns={2}>
        <Grid.Column width={6}>
            <Sticky context={contextRef}>
                <PollDetails
                    header={header}
                    polls={polls}
                    currDaoDetails={currDaoDetails}
                />
            </Sticky>
        </Grid.Column>
        <Grid.Column width={10}>
            <SearchNav onChange={onChange} />
            <PollList 
                onClick={onClick}
                handleOpen={handleOpen}
                handleReset={handleReset}
                polls={polls}
                account={account}
            />
        </Grid.Column>
    </Grid>
)

export default Poll;