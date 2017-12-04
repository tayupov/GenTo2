import React, { Component } from 'react';
import web3 from 'utils/web3';

import GenToFactory from 'assets/contracts/GenToFactory.json';
import { createGentoFactoryInstance } from 'utils/contractInstances';

import GenerateICO from './GenerateICO';

import Name from './steps/Name';
import Amount from './steps/Amount';
import Auction from './steps/Auction';
import Pricing from './steps/Pricing';
import Created from './steps/Created';

class GenerateICOContainer  extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deployedInstance: '',
            icoCreated: false
        }

        this.store = {
            tokenName: '',
            tickerSymbol: '',
            totalSupply: 0,
            auctionType: '',
            selectedCurrency: 'finney',
            minPrice: 0,
            maxPrice: 1,
            saleStart: '',
            saleEnd: ''
        }
    }

    submitTokenContract = () => {

        const { account, network, notify } = this.props;
        if(!(web3 && account && network)) {
            if (!web3) {
                console.log("Web3 has closed!");
            } else if (!account) {
                console.log("You are not logged into your Ethereum account!");
            } else if (!network) {
                console.log("The Ethereum network is down!");
            } else {
                console.log("An unidentified error occurred!");
            }
        return;
        }

        const {
            tokenName,
            tickerSymbol,
            totalSupply,
            auctionType,
            selectedCurrency,
            saleStart,
            saleEnd
         } = this.store;

         let {
            minPrice,
            maxPrice,
         } = this.store;

        if (maxPrice < minPrice) {
            notify("Min > Max Your maximum token price needs to be higher than the minimum token price", "warninig");
            return;
        }

        if (auctionType === 'dutch') {
            const tmp = minPrice;
            minPrice = maxPrice;
            maxPrice = tmp;
        }

        const sellPrice = maxPrice;

        const saleStartDate = new Date(saleStart);
        const saleEndDate = new Date(saleEnd);

        let saleStartForm = Math.floor(saleStartDate / 1000);
        const saleEndForm = Math.floor(saleEndDate / 1000);
        const now = Math.floor(new Date() / 1000);

        if ((now >= saleStartForm) && (now <= saleStartForm + 86400)) {
            const tmpSaleStart = saleStartForm;
            saleStartForm += (now - tmpSaleStart);
        }
        
        return createGentoFactoryInstance(instance => {
                web3.eth.estimateGas({
                    data: GenToFactory.bytecode
                }, (err, gas) => {
                    instance.createContract(
                        web3.toBigNumber(totalSupply).toString(10),
                        tickerSymbol,
                        tokenName,
                        web3.toWei(minPrice, selectedCurrency),
                        web3.toWei(maxPrice, selectedCurrency),
                        web3.toWei(sellPrice, selectedCurrency),
                        web3.toBigNumber(saleStartForm).toString(10),
                        web3.toBigNumber(saleEndForm).toString(10),
                        {
                            from: this.props.account,
                            data: GenToFactory.bytecode,
                            gas: gas
                        }, (err, result) => {
                            if (err) {
                                console.error(err);
                            } else {
                                this.handleContractCreatedEvent(instance);
                                this.setState({icoCreated: true});
                            }
                        }
                    )
                })
            })
    }

    handleContractCreatedEvent = (instance) => {
        const contractCreated = instance.ContractCreated({
            owner: this.props.account
        }, (err, res) => {
            if(!err) {
                const address = res.args.contractAddress
                if (address !== this.state.deployedInstance) {
                    this.setState({
                        deployedInstance: address
                    });
                    this.props.notify("ICO created", "success");
                    contractCreated.stopWatching();
                }
            } else {
                console.error(err);
            }
        })
    }

    getStore = () => {
        return this.store;
    }

    updateStore = (update) => {
        this.store = {
            ...this.store,
            ...update
        }
    }

    render() {

      const steps = [
          {name: 'NAME',component: <Name getStore={this.getStore} updateStore={this.updateStore} />, },
          {name: 'AMOUNT & TIME', component: <Amount getStore={this.getStore} updateStore={this.updateStore} /> },
          {name: 'AUCTION', component: <Auction getStore={this.getStore} updateStore={this.updateStore} /> },
          {name: 'PRICING', component: <Pricing getStore={this.getStore} updateStore={this.updateStore} submitTokenContract={this.submitTokenContract} /> },
          {name: 'CREATED', component: <Created /> }
      ]

        return(
            <GenerateICO
                {...this.props}
                {...this.state}
                steps={steps}
            />
        )
    }
}

export default GenerateICOContainer;
