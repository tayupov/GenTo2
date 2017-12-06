import React from 'react';

import { Card, Button } from 'semantic-ui-react';

import { isInArray } from 'utils/functional';

const styles = {
    card : {
        margin: '0.3em auto'
    }
}

const VotingCard = ({
    header, onClick, handleOpen, handleReset, voterAddresses, account
}) => (
    <Card
      style={styles.card}
      fluid
      raised
      color='teal'
      onClick={onClick}
      header={header}
    >
      <Card.Content>
        <Card.Header>
            {header}
        </Card.Header>
        <Card.Meta>
          5 days left
        </Card.Meta>
        <Card.Description>
          More information on the Voting
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {(!isInArray(account, voterAddresses)) &&
        <div className='ui two buttons'>
          <Button
            basic
            color='green'
            id='approve'
            onClick={handleOpen}
          >
            Approve
          </Button>
          <Button
            basic
            color='red'
            id='decline'
            onClick={handleOpen}
          >
            Decline
          </Button>
        </div>}
        {(isInArray(account, voterAddresses)) &&
        <div>
          <h4 style={{ textAlign: 'center' }}>You already voted on this Proposal!</h4>
          <Button
            basic
            color='green'
            id='edit'
            onClick={handleReset}
            float='right'
            style={{ width: '100%' }}
          >
            Vote again
          </Button>
        </div>}
      </Card.Content>
    </Card>
)

export default VotingCard;