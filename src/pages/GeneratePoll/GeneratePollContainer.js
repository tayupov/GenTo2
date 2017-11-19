import React, { Component } from 'react';

import { gentoFactoryData } from 'contracts';
import { createGentoFactoryInstance, createAuctionTokenInstance } from 'contractInstances';
import web3 from 'myWeb3';

import GeneratePoll from './GeneratePoll';

import General from './steps/General';
import Organisational from './steps/Organisational';

import MultiStep from 'components/MultiStepForm';

class GeneratePollContainer  extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deployedInstance: ''
        }

        this.store = {}
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
            pollName,
            pollEnd,
            pollDescription
         } = this.store;



        const saleEndDate = new Date(pollEnd);

        // TODO create poll using contract
        console.log("Poll "+ pollName + " was created with end date " + saleEndDate);
        console.log("Poll description: "+ pollDescription);
    };

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
                    this.props.notify("Poll created", "success");
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
        console.log(update);
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log(this.store);        
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++');
    }

    render() {

      const steps = [
          {name: 'GENERAL',component: <General getStore={this.getStore} updateStore={this.updateStore} />, },
          {name: 'Organisational', component: <Organisational getStore={this.getStore} updateStore={this.updateStore} submitTokenContract={this.submitTokenContract} /> },
      ]

        return(       
            <GeneratePoll
                {...this.props}
                {...this.state}
                steps={steps}
            />
        )
    }
}

export default GeneratePollContainer;
