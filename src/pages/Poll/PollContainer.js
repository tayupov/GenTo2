import React, { Component } from 'react';

import Poll from './Poll';


import Header from 'components/Header';
import VotingModal from 'components/VotingModal';

class PollContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            polls: [],
            header: 'Issue 99 CVS shares',
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
        // console.log(data.children[0].props.children[0].props.children);
        this.setState({
            header
        })
    }

    handleOpen = (e) => this.setState({ modalOpen: true, modalState: e.target.id })
    
    handleClose = () => this.setState({ modalOpen: false, modalSubmitted: false })

    handleReset = () => {
        const currIndex = this.state.polls.findIndex(obj => obj.header === this.state.header);
        const currAccountIndex = this.state.polls[currIndex].voterAddresses.findIndex(address => address === this.props.account);
        this.state.polls[currIndex].voterAddresses.splice(currAccountIndex, 1);
        // TODO: temporary solution for resetting address votes
        this.state.modalState === 'approve' ? this.state.polls[currIndex].addressesFor-- : this.state.polls[currIndex].addressesAgainst--;
    }

    handleOk = (e) => {
        this.setState({ 
            modalSubmitted: true,
        })
        const currIndex = this.state.polls.findIndex(obj => obj.header === this.state.header);
        this.state.modalState === 'approve' ? this.state.polls[currIndex].addressesFor++ : this.state.polls[currIndex].addressesAgainst++;
        this.state.polls[currIndex].voterAddresses.push(this.props.account);
    }

    listPolls = () => {
        this.setState({
            polls: [
                {
                    header: 'Issue 99 CVS shares',
                    endDate: new Date(),
                    description: '',
                    addressesFor: 8,
                    addressesAgainst: 1,
                    tokensFor: 250,
                    tokensAgainst: 30,
                    voterAddresses: []
                },
                {
                    header: 'Create a stock sale to raise 10 ETH at 0.1 ETH per CVS share',
                    endDate: new Date(),
                    description: '',
                    addressesFor: 10,
                    addressesAgainst: 8,
                    tokensFor: 300,
                    tokensAgainst: 120,
                    voterAddresses: []
                },
                {
                    header: "For Begin stock sale a minimum status of 'executive' will be needed",
                    endDate: new Date(),
                    description: '',
                    addressesFor: 2,
                    addressesAgainst: 1,
                    tokensFor: 70,
                    tokensAgainst: 30,
                    voterAddresses: []
                },
                {
                    header: 'Create a stock sale to raise 50 ETH at 0.1 ETH per CVS share',
                    endDate: new Date(),
                    description: '',
                    addressesFor: 3,
                    addressesAgainst: 1,
                    tokensFor: 97,
                    tokensAgainst: 31,
                    voterAddresses: []
                },
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
                {(this.state.polls.length > 0) && <Poll
                    {...this.props}
                    {...this.state}
                    onClick={this.onClick}
                    handleOpen={this.handleOpen}
                    handleReset={this.handleReset}
                />}
            </div>
        )
    }

}

export default PollContainer;