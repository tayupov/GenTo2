import React, { Component } from 'react';
import PropTypes from 'prop-types';

 
import Dao from './Dao';

import { isFunction } from 'utils/functional';
import web3 from 'myWeb3';
import moment from 'moment';

let purchaseNotify;

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
            if (web3.isAddress(contractAddress)) {
                this.getContractDetails(contractAddress);
            } else {
                console.log('Not a valid ethereum address: ' + contractAddress);
            }
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
        
        if(!(web3 && this.state.auctionDetails && this.props.match.params.address && isFunction(callback))) {
            if (!web3) {
                console.log("Web3 has closed!");
            } else if (!this.state.auctionDetails) {
                console.log("The contract data isn't loaded in.");
            } else if (!this.props.match.params.address) {
                console.log("The contract address isn't loaded in.");
            } else if (!isFunction(callback)) {
                console.log("The callback is not a function!")
            } else {
                console.log("An unidentified error occurred!");
            }
            callback(new Error("Contract not ready for usage"));
            return;
        }
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


    initAuctionDetails = (data) => {
        this.setState({
            auctionDetails: data,
            buyPriceStart: parseInt(web3.fromWei(data._buyPriceStart, this.state.unit), 10),
            buyPriceEnd: parseInt(web3.fromWei(data._buyPriceEnd, this.state.unit), 10),
            status: this.getCurrentStatus(data),
            auctionType: this.getAuctionType(data)
        })
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
        // this.initAuctionDetails(details);
        this.setPriceDevelopmentString();
    }

 
    checkForError = () => {

        if(!(web3 && this.state.auctionDetails && this.props.match.params.address)) {
            if (!web3) {
                console.log("Web3 has closed!");
            } else if (!this.state.auctionDetails) {
                console.log("The contract data isn't loaded in.");
            } else if (!this.props.match.params.address) {
                console.log("The contract address isn't loaded in.");
            } else {
                console.log("An unidentified error occurred!");
            }
            return true;
        } else {
            return false;
        }
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