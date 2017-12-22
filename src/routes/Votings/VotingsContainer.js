import React, { Component } from 'react';

import Vote from './Vote';

import Header from 'components/Header';

class VotingsContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            votings: [],
        };
    }

    componentDidMount() {
    }

    onClick = (e, { header }) => {
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
        // TODO: temporary solution for resetting votes
        this.state.modalState === 'approve' ? this.state.polls[currIndex].addressesFor-- : this.state.polls[currIndex].addressesAgainst--;
        this.state.modalState === 'approve' ? this.state.polls[currIndex].tokensFor -= this.state.currDaoDetails.shTokens : this.state.polls[currIndex].tokensAgainst -= this.state.currDaoDetails.shTokens;
    }

    handleOk = (e) => {
        this.setState({ 
            modalSubmitted: true,
        })
        const currIndex = this.state.polls.findIndex(obj => obj.header === this.state.header);
        this.state.modalState === 'approve' ? this.state.polls[currIndex].addressesFor++ : this.state.polls[currIndex].addressesAgainst++;
        this.state.modalState === 'approve' ? this.state.polls[currIndex].tokensFor += this.state.currDaoDetails.shTokens : this.state.polls[currIndex].tokensAgainst += this.state.currDaoDetails.shTokens;
        this.state.polls[currIndex].voterAddresses.push(this.props.account);
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
                {(this.state.polls.length > 0) && <Vote
                    {...this.props}
                    {...this.state}
                    onClick={this.onClick}
                    handleOpen={this.handleOpen}
                    handleReset={this.handleReset}
                    onChange={this.onChange}
                />}
            </div>
        )
    }

}

export default VotingsContainer;