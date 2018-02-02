import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { loadOrganization } from 'provider/DAOProvider';

import web3 from 'utils/web3';
import { isFunction } from 'utils/functional';
 
import Ico from './Ico';

class IcoContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unit: 'finney',
            auctionType: null,
            buyPriceStart: null,
            buyPriceEnd: null,
            auctionDetails: {},
            tokenCount: 0,
            tokenCountMsg: null,
            accountChanged: false,
            priceDevelopmentString: null,
            currentPercentage: null,
            timeCountDown: null,
            chartDataArr: [],
        }
    }

    componentWillMount() {

        this.getContractDetails();
        this.setState({
            auctionDetails: {
                ...this.props.auctionDetails
            }
        })
        this.setMyTokenCount();
        setInterval(this.getChartData, 10000);
    }

    componentWillReceiveProps(nextProps) {
        this.getContractDetails();
        console.log('NEXT PROPS');
        console.log(nextProps);
        this.setState({
            auctionDetails: {
                ...nextProps.auctionDetails
            }
        })
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
                msg = "You own <strong>" + amount + " </strong>" + this.state.auctionDetails.symbol + " <strong>(=" + (amount * 100 / this.state.auctionDetails.totalSupply).toFixed(0) + "%)</strong> "
            }
            this.setState({
                tokenCountMsg: msg
            })
        })
    }

    checkSupply = async (address, callback) => {
        
        if(!(web3 && this.state.auctionDetails && this.props.address && isFunction(callback))) {
            if (!web3) {
                console.log("Web3 has closed!");
            } else if (!this.state.auctionDetails) {
                console.log("The contract data isn't loaded in.");
            } else if (!this.props.address) {
                console.log("The contract address isn't loaded in.");
            } else if (!isFunction(callback)) {
                console.log("The callback is not a function!")
            } else {
                console.log("An unidentified error occurred!");
            }
            callback(new Error("Contract not ready for usage"));
            return;
        }

        const ico = await loadOrganization(this.props.address);
        ico.balanceOf(address, (error, result) => {
            if(error) {
                callback(error);
            } else {
                callback(null, result);
            }
        })
    }

    getAuctionType = () => {
        if(this.state.buyPriceStart < this.state.buyPriceEnd) {
            return 'english';
        } else if (this.state.buyPriceStart > this.state.buyPriceEnd){
            return 'dutch';
        } else {
            return 'fixed';
        }
    }

    getPriceDevelopmentString = () => {
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

    initAuctionDetails = () => {
        this.setState({
            buyPriceStart: parseInt(web3.fromWei(this.state.buyPriceStart, this.state.unit), 10),
            buyPriceEnd: parseInt(web3.fromWei(this.state.buyPriceEnd, this.state.unit), 10),
            auctionType: this.getAuctionType()
        })
    }

    setPriceDevelopmentString = () => {
        const msg = this.getPriceDevelopmentString();
        this.setState({
            priceDevelopmentString: msg
        })
    }

    getContractDetails = (address) => {
        this.initAuctionDetails();
        this.getChartData();                    
        this.setPriceDevelopmentString();
        
    }

    getChartData = () => {
        const data = this.state.auctionDetails;
        let cd = [];
        cd.push({
            x: moment.unix(data.saleStart).valueOf(),
            y: this.state.buyPriceStart
        });
        const duration = data.saleEnd - data.saleStart;

        const passed = moment().unix() - data.saleStart;
        const currPrice = Math.floor(this.state.buyPriceStart + ((this.state.buyPriceEnd - this.state.buyPriceStart) * passed) / duration);
        cd.push({
            x: moment.unix(data.saleStart + passed).valueOf(),
            y: currPrice
        })

        cd.push({
            x: moment.unix(data.saleEnd).valueOf(),
            y: this.state.buyPriceEnd
        });
        this.setState({
            chartDataArr: cd
        })
    }

    setSupplyInterval = (cb) => {
        const data = this.state.auctionDetails;

        if (data) {
            this.checkSupply(this.props.account, (err, supply) => {
                if(err) {
                    console.error(err);
                } else {
                    supply = supply.toNumber();
                    const supplyPct = ((supply / data.totalSupply) * 100).toFixed(0);
                    const supplyString = `${supply} of ${data.totalSupply} left for sale`;
                    cb({
                        supplyPct,
                        supplyString
                    });
                }
            })
        }    
    }

    buyToken = async (amount, etherUnit) => {

        console.log('buytoken')

        const buyer = this.props.account;
        const value = web3.toWei(amount, etherUnit);
        const ico = await loadOrganization(this.props.address);
     
        web3.eth.estimateGas({
            data: ico.bytecode
        }, (err, gas) => {
                ico.buy(
                    {
                        from: buyer,
                        data: ico.bytecode,
                        value,
                        gas
                    }, (error, result) => {
                        if(error) {
                            this.props.notify('Error processing transaction.', 'error');
                        }
                    }
                ) 
            })
        }

    listenForTokenBuy = async (cb) => {

        const data = this.state.auctionDetails;
        const ico = await loadOrganization(this.props.address)
        const transfers = ico.Transfer();

        transfers.watch((error, result) => {
            if(error) {
                console.error(error);
            } else {
                if (this.state.auctionDetails) {
                    const remainingSupply = result.args._remainingSupply.toNumber();
                    const supplyPct = ((remainingSupply / data.totalSupply) * 100).toFixed(0);
                    const supplyString = `${remainingSupply} of ${data.totalSupply} left for sale`;
                    cb({
                        supplyPct,
                        supplyString
                    });
                }
                let amount = result.args._value.toNumber();
                    
                const transaction = JSON.parse(localStorage.getItem(result.transactionHash));

                if (amount > 0 && !transaction) {
                    this.props.notify("Success! " + amount + " Token(s) purchased.", "success")
                    this.setMyTokenCount();
                    localStorage.setItem(result.transactionHash, JSON.stringify(result.transactionHash));
                    this.props.addDemoDao();
                }
            }
        })
    }

    render() {
        return(
            <Ico
                {...this.props}
                {...this.state}
                key={this.props.address}
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