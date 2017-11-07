import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react';

import TokenBuyForm from './TokenBuyForm';

const TokensSection = ({ tokenCountMsg }) => (
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
                    {/* Give your investment amount:  */}
                    <TokenBuyForm />
                </Segment>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

export default TokensSection;