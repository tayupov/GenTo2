import React, { Component } from 'react';

import { Divider, Button } from 'semantic-ui-react';

import StepZilla from 'react-stepzilla';

import { gentoFactoryData } from 'contracts';
import { createGentoFactoryInstance, createAuctionTokenInstance } from 'contractInstances';
import web3 from 'myWeb3';

import Header from 'components/Header';

import Name from './Name';
import Amount from './Amount';
import Auction from './Auction';
import Pricing from './Pricing';

import MultiStep from 'components/MultiStepForm';


const steps = [
    {name: 'name', component: <Name />},
    {name: 'amount', component: <Amount /> },
    {name: 'auction', component: <Auction /> },
    {name: 'pricing', component: <Pricing /> },
]

class MultiStepForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tokenName: 'MorrorToken',
            tickerSymbol: 'MOR',
            totalSupply: 9000,
            typeOfAuction: 'english',
            selectedCurrency: 'finney',
            minimumPrice: 4000,
            maximumPrice: 9000,
            saleStart: 'Sat Nov 11 2017 13:54:52 GMT+0100 (W. Europe Standard Time)',
            saleEnd: 'Mon Nov 13 2017 13:54:52 GMT+0100 (W. Europe Standard Time)',
            deployedInstance: ''
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
            typeOfAuction,
            selectedCurrency,
            saleStart,
            saleEnd
         } = this.state;

         let {
            minimumPrice,
            maximumPrice,
         } = this.state;

        if (maximumPrice < minimumPrice) {
            notify("Min > Max Your maximum token price needs to be higher than the minimum token price", "warninig");
            return;
        }
        
        if (typeOfAuction === 'dutch') {
            const tmp = minimumPrice;
            minimumPrice = maximumPrice;
            maximumPrice = tmp;
        }
        
        const sellPrice = maximumPrice;

        let saleStartForm = Math.floor(saleStart / 1000);
        const saleEndForm = Math.floor(saleEnd / 1000);
        const now = Math.floor(new Date() / 1000);

        if ((now >= saleStartForm) && (now <= saleStartForm + 86400)) {
            const tmpSaleStart = saleStartForm;
            saleStartForm += (now - tmpSaleStart);
        }

        gentoFactoryData.then(contractData => {
            createGentoFactoryInstance().then(instance => {
                web3.eth.estimateGas({
                    data: contractData.unlinked_binary
                }, (err, gas) => {
                    instance.createContract(
                        web3.toBigNumber(totalSupply).toString(10),
                        tickerSymbol,
                        tokenName,
                        web3.toWei(minimumPrice, selectedCurrency),
                        web3.toWei(maximumPrice, selectedCurrency),
                        web3.toWei(sellPrice, selectedCurrency),
                        web3.toBigNumber(saleStartForm).toString(10),
                        web3.toBigNumber(saleEndForm).toString(10),
                        {
                            from: this.props.account,
                            data: contractData.unlinked_binary,
                            gas: gas
                        }, (err, result) => {
                            if (err) {
                                console.error(err);
                            } else {
                                this.handleContractCreatedEvent(instance);
                                console.log(result);
                            }
                        }
                    )
                })
            })  
        })      
    }

    handleContractCreatedEvent = (instance) => {
        instance.ContractCreated({
            owner: this.props.account
        }, (err, res) => {
            if(!err) {
                const address = res.args.contractAddress
                if (address !== this.state.deployedInstance) {
                    this.setState({
                        deployedInstance: address
                    });
                    this.props.notify("ICO created", "success");
                }
            } else {
                console.error(err);
            }
        })
    }

    render() {
        return(
            // <div className='step-progress' style={{ textAlign: 'center', marginTop: '1em' }}>
            //     <Header text="GENERATE YOUR OWN ICO" />
            //     <StepZilla steps={steps} />
            // </div>
            // <MultiStep />
            <Button onClick={this.submitTokenContract}>Create an ICO</Button>
        )
    }
}

export default MultiStepForm;
