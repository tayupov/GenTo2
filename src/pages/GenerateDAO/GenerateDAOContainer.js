import React, { Component } from 'react';

import web3 from 'utils/web3';

import GenToFactory from 'assets/contracts/GenToFactory.json';
import { createGentoFactoryInstance } from 'utils/contractInstances';

import GenerateDAO from './GenerateDAO';

import General from './steps/General';
import FieldsOfWork from './steps/FieldsOfWork';
import Votings from './steps/Votings';
import IcoGeneral from './steps/IcoGeneral';
import IcoPricing from './steps/IcoPricing';
import Created from './steps/Created';

class GenerateDAOContainer  extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deployedInstance: '',
            icoCreated: false
        }

        this.store = {
            daoName: '',
            daoWebsite: '',
            daoDescription: '',
            dmrReward: 0,
            dmrRewardCurrency: 'finney',
            financePoints: 0,
            productPoints: 0,
            orgPoints: 0,
            partnerPoints: 0,
            minPartic: 10,
            decidingPercentage: 50,
            minVoting: 20,
            maxVoting: 50,
            tokenName: '',
            tickerSymbol: '',
            totalSupply: '',
            selectedCurrency: 'finney',
            minPrice: 0,
            maxPrice: 1,
            saleStart: '',
            saleEnd: ''
        }
    }

    submitTokenContract = () => {

        const { account, network, notify, createDAO } = this.props;

        this.store.daoName = 'EBike Enterprises';
        
        createDAO(this.store);
        
        if(!(web3 && account && network)) {
            if (!web3) {
                console.log("Web3 has closed!");
                notify("Web3 has closed!", "error");
            } else if (!account) {
                console.log("You are not logged into your Ethereum account!");
                notify("You are not logged into your Ethereum account!", "error");                
            } else if (!network) {
                console.log("The Ethereum network is down!");
                notify("The Ethereum network is down!", "error");    
            } else {
                console.log("An unidentified error occurred!");
            }
        return;

        }

        const {
            tokenName,
            tickerSymbol,
            totalSupply,
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

        // if (auctionType === 'dutch') {
        //     const tmp = minPrice;
        //     minPrice = maxPrice;
        //     maxPrice = tmp;
        // }

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
                            console.log('Error has happened');
                            console.error(err);
                        } else {
                            this.handleContractCreatedEvent(instance);
                            console.log(result);
                            this.setState({icoCreated: true});
                        }
                    }
                )
            })
        })
    }

    handleContractCreatedEvent = (instance) => {
        console.log(instance);  
        const contractCreated = instance.ContractCreated({
            owner: this.props.account
        }, (err, res) => {
            console.log('err');
            console.log(err);
            console.log('res');
            console.log(res);
            if(!err) {
                const address = res.args.contractAddress
                console.log('res.args');
                console.log(res.args);
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
        {name: 'GENERAL', component: <General getStore={this.getStore} updateStore={this.updateStore} /> },
        {name: 'FIELDS OF WORK', component: <FieldsOfWork getStore={this.getStore} updateStore={this.updateStore} /> },                
        {name: 'VOTINGS', component: <Votings getStore={this.getStore} updateStore={this.updateStore} /> },
        {name: 'ICO GENERAL', component: <IcoGeneral getStore={this.getStore} updateStore={this.updateStore} /> },
        {name: 'ICO PRICING', component: <IcoPricing getStore={this.getStore} updateStore={this.updateStore} submitTokenContract={this.submitTokenContract} /> },
        {name: 'CREATED', component: <Created /> }
    ]  

        return(
            <GenerateDAO
                {...this.props}
                {...this.state}
                steps={steps}
            />
        )
    }
}

export default GenerateDAOContainer;
