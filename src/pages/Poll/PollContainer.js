import React, { Component } from 'react';

import Poll from './Poll';
import polls from 'polls';

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
            modalSubmitted: false,
            currDaoDetails: {},
            createdPolls: []
        };
    }

    componentDidMount() {
        console.log('this.props.currPoll');
        console.log(this.props.currPoll);
        const createdPolls = this.props.currPoll.filter(poll => poll.daoName === this.props.getCurrDao().daoName)[0].polls;
        this.listPolls(this.props.getCurrDao().daoName, createdPolls);
        this.setState({
            currDaoDetails: this.props.getCurrDao()
        })

        console.log('Polls');
        console.log(this.state.polls);
    }

    onClick = (e, { header }) => {
        // console.log(data.children[0].props.children[0].props.children);
        this.setState({
            header
        })
    }

    handleOpen = (e) => this.setState({ modalOpen: true, modalState: e.target.id })
    
    handleClose = () => this.setState({ modalOpen: false, modalSubmitted: false })

    onChange = (e, { value }) => {
        console.log('onChange')
        console.log(value);
        const currDaoPolls = polls.filter(poll => poll.daoName === this.props.getCurrDao().daoName)[0].polls;
        const currDaoActivePolls = currDaoPolls.filter(poll => poll.state === value);
        const createdActivePolls = this.state.createdPolls.filter(poll => poll.state === value)

        this.setState({
            polls: [
                {
                    header: 'Issue 99 CVS shares',
                    endDate: new Date(),
                    description: '',
                    addressesFor: 8,
                    addressesAgainst: 0,
                    tokensFor: 250,
                    tokensAgainst: 0
                },
                {
                    header: 'Create a stock sale to raise 10 ETH at 0.1 ETH per CVS share',
                    endDate: new Date(),
                    description: '',
                    addressesFor: 10,
                    addressesAgainst: 8,
                    tokensFor: 300,
                    tokensAgainst: 120
                },
                {
                    header: "For Begin stock sale a minimum status of 'executive' will be needed",
                    endDate: new Date(),
                    description: '',
                    addressesFor: 2,
                    addressesAgainst: 1,
                    tokensFor: 70,
                    tokensAgainst: 30
                },
                {
                    header: 'Create a stock sale to raise 10 ETH at 0.1 ETH per CVS share',
                    endDate: new Date(),
                    description: '',
                    addressesFor: 3,
                    addressesAgainst: 1,
                    tokensFor: 97,
                    tokensAgainst: 31
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
                />}
            </div>
        )
    }

}

export default PollContainer;