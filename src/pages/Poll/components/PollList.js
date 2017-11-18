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
    <Card.Group style={{marginTop: '1.8em'}}>
        <Card onClick={onClick} style={styles.card} fluid raised color='teal' header='Issue 99 CVS shares' />
        <Card onClick={onClick} style={styles.card} fluid raised color='teal' header='Create a stock sale to raise 10 ETH at 0.1 ETH per CVS share' />
        <Card onClick={onClick} style={styles.card} fluid raised color='teal' header="For Begin stock sale a minimum status of 'executive' will be needed" />                        
    </Card.Group>
)

export default PollList;