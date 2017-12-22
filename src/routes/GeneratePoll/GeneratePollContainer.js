import React, { Component } from 'react';
import web3 from 'utils/web3';

import General from './steps/General';
import GeneratePoll from './GeneratePoll';
import Organisational from './steps/Organisational';
import Created from './steps/Created';

class GeneratePollContainer  extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deployedInstance: ''
        }

        this.store = {
            pollName: '',
            pollCategory: 'organisational',
            pollDescription: '',
            pollEnd: new Date(),
            pollPayout: 0,
            pollCurrency: 'finney'
        }
    }

    submitTokenContract = () => {

        this.props.setCurrPoll(this.store);

        const { account, network } = this.props;
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
            pollDescription,
            pollPayout
         } = this.store;

        const saleEndDate = new Date(pollEnd);

        this.props.notify("Poll created", "success");

        // TODO create poll using contract
        console.log("Poll "+ pollName + " was created with end date " + saleEndDate + " and the payout amount of " + pollPayout);
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
    }

    render() {

        const steps = [
            {name: 'GENERAL',component: <General getStore={this.getStore} updateStore={this.updateStore} />},
            {name: 'ORGANISATIONAL', component: <Organisational getStore={this.getStore} updateStore={this.updateStore} submitTokenContract={this.submitTokenContract} /> },
            {name: 'POLL CREATED', component: <Created />}
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
