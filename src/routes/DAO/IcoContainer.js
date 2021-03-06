import React, { Component } from 'react';
import moment from 'moment';
import web3 from 'utils/web3';
import Ico from './Ico';

import { loadOrganization } from 'provider/DAOProvider';

class IcoContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unit: 'finney',
            auctionType: null,
            buyPriceStart: null,
            buyPriceEnd: null,
            auctionDetails: {
                address: null,
                name: null,
                symbol: null,
                saleStart: null,
                saleEnd: null,
                isICOFinished: null,
                numberOfProposals: null,
                numberOfShareholders: null,
                totalSupply: null,
                remainingTokensForICOPurchase: null,
                descriptionHash: null,
                delegate: null,
                balanceForAccount: null,
                numberOfTokensInICO: null,
            },
            tokenCount: 0,
            tokenCountMsg: null,
            accountChanged: false,
            priceDevelopmentString: null,
            currentPercentage: null,
            timeCountDown: null,
            chartDataArr: [],
        }
    }

    async loadOrganizationData(address, account) {
        const ICO = await loadOrganization(address, account, true)
        this.setState({
            auctionDetails: {
                ...ICO
            }
        })
        this.setMyTokenCount();
        if (ICO.saleStart !== null) {
            this.getContractDetails(ICO);
        }
      }

    async componentWillMount() {
        
        this.loadOrganizationData(this.props.address, undefined)
    }

    componentWillReceiveProps(nextProps) {
        this.loadOrganizationData(this.props.address, this.props.account)
        
    }

    componentDidUpdate(nextProps) {
        if(nextProps.account !== this.props.account) {
            this.setMyTokenCount();
        }
    }

    setMyTokenCount = async () => {
        const ico = await loadOrganization(this.props.address);
        const amount = await ico.balanceOf.call(this.props.account);
        const tokenCount = +web3.fromWei(amount, 'finney')
        const totalSupply = await ico.remainingTokensForICOPurchase.call();
        const remainingTokensForICOPurchase = +web3.fromWei(totalSupply, 'finney')
        const symbol = await ico.symbol.call();
        this.setState({
            tokenCount
        });
        const msg = "You own <strong>" + tokenCount + " </strong>" + symbol + " <strong>(=" + (tokenCount * 100 / remainingTokensForICOPurchase).toFixed(0) + "%)</strong> "
        this.setState({
            tokenCountMsg: msg
        })
    }


    getCurrentStatus = (details) => {
        const start = moment.unix(details.saleStart);
        const end = moment.unix(details.saleEnd);
        const now = moment();
        if(now.diff(start) < 0) {
            return 'pending';
        } else if (now.diff(end) < 0){
            return 'running';
        } else {
            return 'over'
        }
    }

    getAuctionType = (details) => {;
        if(details.buyPriceStart < details.buyPriceEnd) {
            return 'english';
        } else if (details.buyPriceStart > details.buyPriceEnd){
            return 'dutch';
        } else {
            return 'fixed';
        }
    }

    getPriceDevelopmentString = (details) => {
        let priceDev = "The token price ";
        if(this.state.auctionType === "dutch") {
            priceDev += "will <strong>decrease</strong> from <strong>" + details.buyPriceStart + "</strong> to <strong>" + details.buyPriceEnd + "</strong>";
        } else if(this.state.auctionType === "english") {
            priceDev += "will <strong>increase</strong> from <strong>" + details.buyPriceStart + "</strong> to <strong>" + details.buyPriceEnd + "</strong>";            
        } else {
            priceDev += "is <strong>" + details.buyPriceStart + "</strong>";
        }
        priceDev += " " + this.state.unit;
        return priceDev;
    }

    initAuctionDetails = (details) => {
        this.setState({
            buyPriceStart: parseInt(web3.fromWei(details.buyPriceStart, this.state.unit), 10),
            buyPriceEnd: parseInt(web3.fromWei(details.buyPriceEnd, this.state.unit), 10),
            status: this.getCurrentStatus(details),
            auctionType: this.getAuctionType(details)
        })
    }

    setPriceDevelopmentString = (details) => {
        const msg = this.getPriceDevelopmentString(details);
        this.setState({
            priceDevelopmentString: msg
        })
    }

    getContractDetails = (details) => {
        this.initAuctionDetails(details);
        this.getChartData(details);                    
        this.setPriceDevelopmentString(details);   
    }

    getChartData = (details) => {
        let cd = [];
        if (!details) {
            return;
        }
        cd.push({
            x: moment.unix(details.saleStart).valueOf(),
            y: this.state.buyPriceStart
        });

        const duration = details.saleEnd.c[0] - details.saleStart.c[0];
    
        if(this.state.status === 'running'){
            const passed = moment().unix() - details.saleStart.c[0];
            const currTime = details.saleStart.c[0] + passed;
            const currPrice = Math.floor(this.state.buyPriceStart + ((this.state.buyPriceEnd - this.state.buyPriceStart) * passed) / duration);
            cd.push({
                x: moment.unix(currTime).valueOf(),
                y: currPrice
            })
        }
        cd.push({
            x: moment.unix(details.saleEnd).valueOf(),
            y: this.state.buyPriceEnd
        });

        this.setState({
            chartDataArr: cd
        })
    }

    setSupplyInterval = async (cb) => {
        const details = this.state.auctionDetails;
        const remainingTokensForICOPurchase = details.remainingTokensForICOPurchase;
        const supplyPct = ((remainingTokensForICOPurchase / details.numberOfTokensInICO) * 100).toFixed(0);
        const supplyString = `${remainingTokensForICOPurchase} of ${details.numberOfTokensInICO} left for sale`;
        cb({
            supplyPct,
            supplyString
        });
    }    

    buyToken = async (amount, etherUnit) => {
        const buyer = this.props.account;
        const value = web3.toWei(amount, etherUnit);
        const ico = await loadOrganization(this.props.address);    
        await ico.buy.sendTransaction({from: buyer, value})
        }

    listenForTokenBuy = async (cb) => {
        // surprise surprise
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

export default IcoContainer;