import React, { Component } from 'react';

import Poll from './Poll';

class PollContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            header: ''
        };
    }

    onClick = (e, { header }) => {
        this.setState({
            header
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