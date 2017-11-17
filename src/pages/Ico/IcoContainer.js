import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createAuctionTokenInstance } from 'contractInstances';
import { auctionTokenData } from 'contracts';
 
import Ico from './Ico';

import { isFunction } from 'utils';
import web3 from 'myWeb3';
import moment from 'moment';

let purchaseNotify;

class IcoContainer extends Component {

    constructor() {
        super();

        this.state = {
            unit: 'finney',
            status: null,
            auctionType: null,
            buyPriceStart: null,
            buyPriceEnd: null,
            auctionDetails: {},
            auctionDetailsParsed: {},
            tokenCount: 0,
            tokenCountMsg: null,
            accountChanged: false,
            priceDevelopmentString: null,
            currentPercentage: null,
            timeCountDown: null,
            chartDataArr: []
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
        setInterval(this.getChartData, 10000);
    }

    componentDidUpdate(nextProps) {
        if(nextProps.account !== this.props.account) {
            this.setMyTokenCount();
        }
    }

    setMyTokenCount = () => {
        this.checkSupply(this.props.account, (err, res) => {
            let msg;
            if(err) {
                msg = "Pending...";
            } else {
                let amount = res.toNumber();
                this.setState({
                    tokenCount: amount
                });
                msg = "You own <strong>" + amount + " </strong>" + this.state.auctionDetails._symbol + " <strong>(=" + (amount * 100 / this.state.auctionDetails._totalSupply).toFixed(2) + "%)</strong> "
            }
            this.setState({
                tokenCountMsg: msg
            })
        })
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

        createAuctionTokenInstance(this.props.match.params.address).then(instance => {
            instance.balanceOf(address, (error, result) => {
                if(error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            })
        })
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

    getPriceDevelopmentString = () => {
        const data = this.state.auctionDetails;
        let priceDev = "The token price ";
        if(this.state.auctionType === "dutch") {
            priceDev += "will <strong>decrease</strong> from <strong>" + this.state.buyPriceStart + "</strong> to <strong>" + this.state.buyPriceEnd + "</strong>";
        } else if(this.state.auctionType === "english") {
            priceDev += "will <strong>increase</strong> from <strong>" + this.state.buyPriceStart + "</strong> to <strong>" + this.state.buyPriceEnd + "</strong>";            
        } else {
            priceDev += "is <strong>" + this.state.buyPriceStart + "</strong>";
        }
        priceDev += " " + this.state.unit;
        return priceDev;
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

    setPriceDevelopmentString = () => {
        const msg = this.getPriceDevelopmentString();
        this.setState({
            priceDevelopmentString: msg
        })
    }

    parseContractDetails = (rawData) => {
        return {
            _owner: rawData[0],
            _name: rawData[1],
            _symbol: rawData[2],
            _totalSupply: rawData[3],
            _creationDate: rawData[4].toNumber(),
            _buyPriceStart: rawData[5].toNumber(),
            _buyPriceEnd: rawData[6].toNumber(),
            _sellPrice: rawData[7].toNumber(),
            _saleStart: rawData[8].toNumber(),
            _saleEnd: rawData[9].toNumber(),
        }
    }

    getContractDetails = (address) => {

        if(this.checkForError()) {
            return;
        }

        createAuctionTokenInstance(address).then(instance => {
            instance.getDetails((error, result) => {
                if(error) {
                    console.error(error);
                } else {
                    let data = this.parseContractDetails(result);
                    this.setState({
                        auctionDetailsParsed: data,
                    })
                    this.initAuctionDetails(data);
                    this.getChartData();                    
                    this.setPriceDevelopmentString();
                }
            })
        })
    }

    getChartData = () => {
        const data = this.state.auctionDetails;
        let cd = [];
        cd.push({
            x: moment.unix(data._saleStart).valueOf(),
            y: this.state.buyPriceStart
        });
        const duration = data._saleEnd - data._saleStart;
        if(this.state.status === 'running'){
            const passed = moment().unix() - data._saleStart;
            const currPrice = Math.floor(this.state.buyPriceStart + ((this.state.buyPriceEnd - this.state.buyPriceStart) * passed) / duration);
            cd.push({
                x: moment.unix(data._saleStart + passed).valueOf(),
                y: currPrice
            })
        }
        cd.push({
            x: moment.unix(data._saleEnd).valueOf(),
            y: this.state.buyPriceEnd
        });
        this.setState({
            chartDataArr: cd
        })
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

    setSupplyInterval = (cb) => {
        const data = this.state.auctionDetails;

        if (data) {
            this.checkSupply(data._owner, (err, supply) => {
                if(err) {
                    console.error(err);
                } else {
                    supply = supply.toNumber();
                    const supplyPct = ((supply / data._totalSupply) * 100).toFixed(2);
                    const supplyString = `${supply} of ${data._totalSupply} left for sale`;
                    cb({
                        supplyPct,
                        supplyString
                    });
                }
            })
        }    
    }

    buyToken = (amount, etherUnit) => {

        if(this.checkForError()) {
            return;
        }

        const buyer = this.props.account;
        const value = web3.toWei(amount, etherUnit);
     
        web3.eth.estimateGas({
            data: auctionTokenData.unlinked_binary
        }, (err, gas) => {
            if (err) {
                console.error(err);
                return;
            }
            createAuctionTokenInstance(this.props.match.params.address).then(instance => {
                instance.buy(
                    {
                        from: buyer,
                        data: auctionTokenData.unlinked_binary,
                        value,
                        gas
                    }, (error, result) => {
                        if(error) {
                            this.props.notify('Error processing transaction.', 'error');
                        }
                    }
                ) 
            })
        })
    }

    listenForTokenBuy = (cb) => {

        if(this.checkForError()) {
            return;
        }

        console.log('Wurde wenigstens aufrufen!');

        const data = this.state.auctionDetails;
        createAuctionTokenInstance(this.props.match.params.address).then(instance => {

            const transfers = instance.Transfer();

            transfers.watch((error, result) => {
                if(error) {
                    console.error(error);
                } else {
                    if (this.state.auctionDetails) {
                        const remainingSupply = result.args._remainingSupply.toNumber();
                        const supplyPct = ((remainingSupply / data._totalSupply) * 100).toFixed(2);
                        const supplyString = `${remainingSupply} of ${data._totalSupply} left for sale`;
                        cb({
                            supplyPct,
                            supplyString
                        });
                    }
                    let amount = result.args._value.toNumber();
                     
                    const transaction = JSON.parse(localStorage.getItem(result.transactionHash));

                    console.log('transaction');
                    console.log(transaction);
                    console.log('result.transactionHash');
                    console.log(result.transactionHash);
                    console.log('result');
                    console.log(result);
    
                    if (amount > 0 && !transaction) {
                        this.props.notify("Success! " + amount + " Token(s) purchased.", "success")
                        this.setMyTokenCount();
                        localStorage.setItem(result.transactionHash, JSON.stringify(result.transactionHash));
                    }
    
                    // transfers.stopWatching();
                }
            })
        })
    }

    render() {
        return(
            <Ico
                {...this.props}
                {...this.state}
                setSupplyInterval={this.setSupplyInterval}
                buyToken={this.buyToken}
                listenForTokenBuy={this.listenForTokenBuy}
            />
        )
    }
}

IcoContainer.propTypes = {
    account: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired
}



export default IcoContainer;