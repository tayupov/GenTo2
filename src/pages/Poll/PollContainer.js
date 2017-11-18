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

    componentDidUpdate(nextProps) {
        if (nextProps.account !== this.props.account) {
            this.setState({
                polls: [],
            }, this.listPolls())
        }
    }

    onClick = (e, { header }) => {
        this.setState({
            header
        })
    }

    listPolls = () => {
        
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