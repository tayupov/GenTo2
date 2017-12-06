import React, { Component } from 'react';

import Poll from './Poll';
import polls from './polls';

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
            currDaoDetails: {}
        };
    }

    componentDidMount() {
        this.listPolls(this.props.getCurrDao().daoName);
        this.setState({
            currDaoDetails: this.props.getCurrDao()
        })
    }

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

    listPolls = (currDaoName) => {
        const currDaoPolls = polls.filter(poll => poll.daoName === currDaoName)[0].polls;
        
        this.setState({
            polls: currDaoPolls,
            header: currDaoPolls[0].header
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