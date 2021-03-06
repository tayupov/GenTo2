import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Header, Segment } from 'semantic-ui-react';

import TokenBuyForm from './TokenBuyForm';

const TokenSection = ({ tokenCountMsg, buyToken }) => (
    <Grid>
        <Grid.Row>
            <Grid.Column width={8}>
                <Header as='h2' attached textAlign='left'>
                    My Tokens
                </Header>
                <Segment attached padded raised textAlign='left' color='olive'>
                <div dangerouslySetInnerHTML={{__html: tokenCountMsg}}></div>
                </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
                <Header as='h2' attached textAlign='right'>
                    Buy tokens now!
                </Header>
                <Segment attached padded raised textAlign='right' color='olive'>
                    <TokenBuyForm buyToken={buyToken} />
                </Segment>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

TokenSection.propTypes = {
    tokenCountMsg: PropTypes.string.isRequired,
    buyToken: PropTypes.func.isRequired
};

export default TokenSection;