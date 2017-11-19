import React, { Component } from 'react';

import Poll from './Poll';

class PollContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            polls: [],
            header: 'Do we want to raise the value?'
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
        return (
            <Poll
                {...this.props}
                {...this.state}
                onClick={this.onClick}
            />
        )
    }

}

export default PollContainer;