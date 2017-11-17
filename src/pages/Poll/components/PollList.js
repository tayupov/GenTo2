import React from 'react';

import { Card } from 'semantic-ui-react';

const styles = {
    card : {
        margin: '0.3em auto'
    }
}

const PollList = ({
    onClick
}) => (
    <Card.Group>
        <Card onClick={onClick} style={styles.card} fluid raised color='teal' header='Do we want to raise the value?' />
        <Card onClick={onClick} style={styles.card} fluid raised color='teal' header='Do we want to change our location?' />
        <Card onClick={onClick} style={styles.card} fluid raised color='teal' header='Do we want to make a difference in the world?' />                        
    </Card.Group>
)

export default PollList;