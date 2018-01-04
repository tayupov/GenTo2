import React from 'react';

import { Grid, Sticky } from 'semantic-ui-react';

import VoteList from './components/VoteList';
import SearchNav from './components/VoteList/components/SearchNav';
import VoteDetails from './components/VoteDetails';

const DAOVotings = ({
  header, onClick, handleOpen, handleReset, polls, contextRef, account, currDaoDetails, onChange
}) => (
    <Grid columns={2}>
      <Grid.Column width={6}>
        <Sticky context={contextRef} offset={80}>
          <VoteDetails
            header={header}
            polls={polls}
            currDaoDetails={currDaoDetails}
            />
        </Sticky>
      </Grid.Column>
      <Grid.Column width={10}>
        <SearchNav onChange={onChange} />
        <VoteList
          onClick={onClick}
          handleOpen={handleOpen}
          handleReset={handleReset}
          polls={polls}
          account={account}
          />
      </Grid.Column>
    </Grid>
  )

export default DAOVotings;