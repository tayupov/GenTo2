import React from 'react';

import { loadProposal, loadVote, vote, executeProposal } from 'provider/ProposalProvider'

import Proposal from './Proposal';

export default class ProposalContainer extends React.Component {

    constructor() {
        super();
        this.state = {
                proposal: {
                    proposalNumber: "",
                    recipient:"",
                    amount:"",
                    name:"",
                    description:"",
                    proposalDeadline:"",
                    finished:"",
                    proposalPassed:"",
                    passedPercent: "",
                    dividend:""
                },
            vote: {
                support: "?",
                voted: "?"

            }
        }
    }

    async componentDidMount() {

        const proposal = await loadProposal(this.props.address, this.props.proposalNumber)
        proposal.amount = proposal.amount.toString(10)
        proposal.dividend = proposal.dividend.toString(10)
        proposal.passedPercent = proposal.passedPercent.toString(10)
        proposal.proposalDeadline = proposal.proposalDeadline.toString(10)
        proposal.fieldOfWork = proposal.fieldOfWork.toString(10)
        this.setState({proposal});

        const vote = await loadVote(this.props.address, this.props.proposalNumber, this.props.account)
        this.setState({vote});
    }
    async handleCreate() {

    }


    async approveCallback(){
        await vote(this.props.address, this.props.proposalNumber,true, this.props.account)
    }

    async disapproveCallback(){
        await vote(this.props.address, this.props.proposalNumber,false, this.props.account)

    }
    async executeCallback(){
        await executeProposal(this.props.address, this.props.proposalNumber)
    }

    render() {
        return (<Proposal proposal={this.state.proposal}
                          vote={this.state.vote}
                          approveCallback={this.approveCallback.bind(this)}
                          disapproveCallback={this.disapproveCallback.bind(this)}
                          executeCallback={this.executeCallback.bind(this)}
                          address={this.props.address} />
                )
    }
}
