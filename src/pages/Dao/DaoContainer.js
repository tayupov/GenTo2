import React, { Component } from 'react';

import Dao from './Dao';

class DaoContainer extends Component {

    render() {
        return (
            <Dao name={this.props.match.params.address} />
        )
    }
}
export default DaoContainer;