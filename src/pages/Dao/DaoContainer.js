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
            auctionDetailsParsed: {}
        }
    }

    componentWillMount() {
        let contractAddress = this.props.match.params.address;
        if (contractAddress) {
            this.getContractDetails(contractAddress);
            
        } else {
            console.log('Missing address parameter');
        }
    }


    getContractDetails = (address) => {

        if(this.checkForError()) {
            return;
        }

        // TODO Get data from smart contrat
        var details = {_name: "sdf",
            _owner:"liawdawjd",
            _symbol: "asdf"
        };
        this.setState({auctionDetailsParsed:details});
    }


    checkForError = () => {
        
    }


    render() {
        return(
            <Dao
                {...this.props}
                {...this.state}
                setSupplyInterval={this.setSupplyInterval}
                buyToken={this.buyToken}
                listenForTokenBuy={this.listenForTokenBuy}
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