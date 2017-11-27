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
                    header: 'Issue 99 CVS shares'
                },
                {
                    header: 'Create a stock sale to raise 10 ETH at 0.1 ETH per CVS share'
                },
                {
                    header: "For Begin stock sale a minimum status of 'executive' will be needed"
                },
                {
                    header: 'Create a stock sale to raise 10 ETH at 0.1 ETH per CVS share'
                },
                {
                    header: 'Change companies logo'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
                },
                {
                    header: 'Issue 1000 CVS shares'
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