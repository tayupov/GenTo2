import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid, Header, Segment, Progress } from 'semantic-ui-react';
import moment from 'moment';

let auctionInterval;

class DetailsSection extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            timeCountDown: '',
            currentPercentage: null,
            supplyObj: { }
        }
    }

    setAuctionTimer = () => {
        const { details, status } = this.props;
        let timeCountDown;

        if(status === "pending") {
            timeCountDown = "Auction will start at " + moment.unix(details._saleStart).format('LLL');
        } else if (status === "running") {
            const endTime = moment.unix(details._saleEnd);
            let duration = moment.duration(endTime.diff(moment()));
            const interval = 1000;

            timeCountDown = duration.days() + " d " + duration.hours() + " h " + duration.minutes() + " m " + duration.seconds() + " s left";

            auctionInterval = setInterval(() => {
                if(endTime.diff(moment()) < 0) {
                    this.setAuctionTimer();
                }
                duration = moment.duration(duration - interval);
                timeCountDown = duration.days() + " d " + duration.hours() + " h " + duration.minutes() + " m " + duration.seconds() + " s left";
                let currentPercentage = ((endTime.diff(moment()) / endTime.diff(moment.unix(details._saleStart))) * 100).toFixed(2);
                this.setState({
                    timeCountDown,
                    currentPercentage
                })
            }, interval)
        }
    }

    componentWillMount() {
        this.setAuctionTimer();

        this.props.setSupplyInterval((obj) => {
            this.setState({
                supplyObj: obj
            })
        });

        this.props.listenForTokenBuy((obj) => {
            this.setState({
                supplyObj: obj
            })
        })
    }

    render() {
        const { details, priceDevelopmentString } = this.props;
        const { supplyObj, timeCountDown, currentPercentage } = this.state;

        return (
            <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='left'>
                        Token Name
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
                        {moment.unix(details._creationDate).format('LLL')}
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
                        Number of Tokens
                    </Header>
                    <Segment attached padded raised textAlign='left' color='olive'>
                        <Progress percent={supplyObj.supplyPct} indicating progress label={supplyObj.supplyString} />
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='right'>
                        Period of Auction
                    </Header>
                    <Segment attached padded raised textAlign='right' color='olive'>
                        <Progress percent={currentPercentage} indicating progress label={timeCountDown} />
                    </Segment>
                </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
                <Grid.Column>
                    <Header as='h2' attached textAlign='center'>
                        Price over time
                    </Header>
                    <Segment attached padded textAlign='center' color='olive'>
                        <div dangerouslySetInnerHTML={{__html: priceDevelopmentString}}></div>
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