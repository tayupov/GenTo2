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

    componentDidUpdate(nextProps) {
        if(nextProps.account !== this.props.account) {
            this.setMyTokenCount();
        }
    }

    checkSupply = (address, callback) => {

    }

    getCurrentStatus = (data) => {
        const start = moment.unix(data._saleStart);
        const end = moment.unix(data._saleEnd);
        const now = moment();
        if(now.diff(start) < 0) {
            return 'pending';
        } else if (now.diff(end) < 0){
            return 'running';
        } else {
            return 'over'
        }
    }

    getAuctionType = (data) => {
        if(data._buyPriceStart < data._buyPriceEnd) {
            return 'english';
        } else if (data._buyPriceStart > data._buyPriceEnd){
            return 'dutch';
        } else {
            return 'fixed';
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