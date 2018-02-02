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
        setInterval(this.getChartData, 10000);
    }

    componentDidMount() {
        // this.setMyTokenCount();
    }

    componentWillReceiveProps(nextProps) {
        this.getContractDetails();
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

    setMyTokenCount = async () => {
        const ico = await loadOrganization(this.props.address);
        const amount = +await ico.balanceOf.call([this.props.account]);
        const totalSupply = +await ico.totalSupply.call();
        const symbol = +await ico.symbol.call();
        this.setState({
            tokenCount: amount
        });
        const msg = "You own <strong>" + amount + " </strong>" + symbol + " <strong>(=" + (amount * 100 / totalSupply).toFixed(0) + "%)</strong> "
        this.setState({
            tokenCountMsg: msg
        })
    }


    getCurrentStatus = () => {
        const start = moment.unix(this.state.auctionDetails.saleStart);
        const end = moment.unix(this.state.auctionDetails.saleEnd);
        const now = moment();
        if(now.diff(start) < 0) {
            return 'pending';
        } else if (now.diff(end) < 0){
            return 'running';
        } else {
            return 'over'
        }
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
            status: this.getCurrentStatus(),
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
        if(this.state.status === 'running'){
            const passed = moment().unix() - data.saleStart;
            const currPrice = Math.floor(this.state.buyPriceStart + ((this.state.buyPriceEnd - this.state.buyPriceStart) * passed) / duration);
            cd.push({
                x: moment.unix(data.saleStart + passed).valueOf(),
                y: currPrice
            })
        }
        cd.push({
            x: moment.unix(data.saleEnd).valueOf(),
            y: this.state.buyPriceEnd
        });
        this.setState({
            chartDataArr: cd
        })
    }

    setSupplyInterval = async (cb) => {
        const ico = await loadOrganization(this.props.address, true);
        const supply = ico.remainingTokensForICOPurchase;
        const totalSupply = ico.totalSupply;
        const supplyPct = ((supply / totalSupply) * 100).toFixed(0);
        const supplyString = `${supply} of ${totalSupply} left for sale`;
        cb({
            supplyPct,
            supplyString
        });
    }    


    buyToken = async (amount, etherUnit) => {

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