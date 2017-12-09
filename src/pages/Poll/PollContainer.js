import React, { Component } from 'react';

import Poll from './Poll';


import Header from 'components/Header';
import VotingModal from 'components/VotingModal';

class PollContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            polls: [],
            header: 'Do we want to raise the value?',
            modalOpen: false,
            modalState: '',
            modalSubmitted: false
        };
    }

    componentDidMount() {
        this.listPolls();
    }

    // componentDidUpdate(nextProps) {
    //     if (nextProps.account !== this.props.account) {
    //         this.setState({
    //             polls: [],
    //         }, this.listPolls())
    //     }
    // }

    onClick = (e, { header }) => {
        this.setState({
            header
        })
    }

    handleOpen = (e) => {this.setState({ modalOpen: true, modalState: e.target.id })}
    
    handleClose = () => this.setState({ modalOpen: false, modalSubmitted: false })

    handleOk = () => this.setState({ modalSubmitted: true })

    listPolls = () => {
        this.setState({
            polls: [
                {
                    header: 'Pay out 100 eth in dividend in Beginning of Q1',
                    fieldOfWork: "finance"
                },
                {
                    header: 'Switch to battery Tesla 48V 35Ah 1000W Li-Ion',
                    fieldOfWork: "product"
                },

                {
                    header: 'Offer bike in additional color #992020',
                    fieldOfWork: "product"
                },
                {
                    header: "Change decision maker reward for product to 10eth/quarter starting Q2 2018",
                    fieldOfWork: "organisation"
                },
                {
                    header: 'Offer free Strava bike app with every bike for 150eth',
                    fieldOfWork: "partnership"
                },
                {
                    header: 'Change company Logo (see attachment)',
                    fieldOfWork: "product"
                }
            ]
        })
    }

    render() {
        const { header, modalOpen, modalState, modalSubmitted } = this.state;

        return (
            <div>
                <Header text='LIST OF VOTINGS' />
                <VotingModal
                    header = {header}
                    modalOpen={modalOpen}
                    modalState={modalState}
                    modalSubmitted={modalSubmitted}
                    handleClose={this.handleClose}
                    handleOk={this.handleOk}
                />
                <Poll
                    {...this.props}
                    {...this.state}
                    onClick={this.onClick}
                    handleOpen={this.handleOpen}
                />
            </div>
        )
    }

}

export default PollContainer;