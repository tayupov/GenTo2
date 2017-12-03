import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid, Header, Segment, Progress, Input } from 'semantic-ui-react';
import moment from 'moment';

let auctionInterval;

const tokenPriceIncrease = 'The token price will <strong>increase</strong> from <strong>1000</strong> to <strong>10000</strong> finney'

class DetailsSection extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            timeCountDown: '',
            currentPercentage: null,
            supplyObj: { }
        }
    }


    componentWillMount() {
        //
        // this.props.setSupplyInterval((obj) => {
        //     this.setState({
        //         supplyObj: obj
        //     })
        // });
    }

    render() {
        const { details, status, priceDevelopmentString } = this.props;
        const { supplyObj, timeCountDown, currentPercentage } = this.state;

        return (
            <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='left'>
                        Dao Name
                    </Header>
                    <Segment attached padded raised textAlign='left' color='olive'>
                        {details._name}
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='right'>
                        Created at
                    </Header>
                    <Segment attached padded raised textAlign='right' color='olive'>
                        aaaaaaa
                    </Segment>
                </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='left'>
                        Ticker Symbol
                    </Header>
                    <Segment attached padded raised textAlign='left' color='olive'>
                        {details._symbol}
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='right'>
                        Owned By
                    </Header>
                    <Segment attached padded raised textAlign='right' color='olive'>
                        {details._owner}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='left'>
                        Number of tokens owned
                    </Header>
                    <Segment attached padded raised textAlign='left' color='olive'>
                        12/1000
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='right'>
                        Total voting power
                    </Header>
                    <Segment attached padded raised textAlign='right' color='olive'>
                        78
                    </Segment>
                </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='center'>
                        Voting power
                    </Header>
                    <Segment attached padded textAlign='center' color='olive'>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Field of work
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    voting power
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    voting points
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Organisational
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    16/1000
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    1
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Product
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    5/1000
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    0
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Finance
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    50
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Marketing
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    0/1000
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    0
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='center'>
                        Transfer Voting power
                    </Header>
                    <Segment attached padded textAlign='center' color='olive'>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Organisational
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Input name="foo" type="text" placeholder="Username" value="" class="prompt" autocomplete="on" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Product
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Input name="foo" type="text" placeholder="Username" value="" class="prompt" autocomplete="on" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Finance
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Input name="foo" type="text" placeholder="Username" value="" class="prompt" autocomplete="on" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    Marketing
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Input name="foo" type="text" placeholder="Username" value="" class="prompt" autocomplete="on"
                                           defaultValue='eji3r212hio12epq' />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }
}

DetailsSection.propTypes = {
    details: PropTypes.object.isRequired,
    priceDevelopmentString: PropTypes.string.isRequired,
    timeCountDown: PropTypes.string.isRequired,
    currentPercentage: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    setSupplyInterval: PropTypes.func.isRequired,
    listenForTokenBuy: PropTypes.func.isRequired
}

export default DetailsSection;