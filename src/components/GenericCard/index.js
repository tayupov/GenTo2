import React from 'react';

import { Card, Button } from 'semantic-ui-react';

const styles = {
    card : {
        margin: '0.3em auto'
    }
}

const GenericCard = ({
    header, onClick
}) => (
    <Card onClick={onClick} style={styles.card} fluid raised color='teal' header={header}>
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
        <div className='ui two buttons'>
          <Button basic color='green'>Approve</Button>
          <Button basic color='red'>Decline</Button>
        </div>
      </Card.Content>
    </Card>
)

export default GenericCard;