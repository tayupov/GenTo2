import React, { Component } from 'react';
import PropTypes from 'prop-types';


import Dao from './Dao';

import { isFunction } from 'utils/functional';
import moment from 'moment';


class DaoContainer extends Component {

    constructor() {
        super();

        this.state = {
            totalToke: 1000,
            ownToken: 12,
            daoDetailsParsed: {}
        }
    }

    componentWillMount() {
        window.scrollTo(0, 0);
        this.setState({
            daoDetailsParsed: this.props.getCurrDao()
        })
    }


    render() {
        return(
            <Dao
                {...this.props}
                {...this.state}
            />
        )
    }
}

DaoContainer.propTypes = {
    account: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired
}



export default DaoContainer;