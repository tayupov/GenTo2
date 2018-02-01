import React from 'react';

import { loadProposal, loadVote, vote } from 'provider/ProposalProvider'

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
        this.setState({proposal});
        
        const vote = await loadVote(this.props.address, this.props.proposalNumber, this.props.account)
        this.setState({vote});
    }
    async handleCreate() {

    }


    async approve(){
        await vote(this.props.address, this.props.proposalNumber,true, this.props.account)
    }

    async disapprove(){
        await vote(this.props.address, this.props.proposalNumber,false, this.props.account)

    }

    render() {
        return (<Proposal proposal={this.state.proposal}
                          vote={this.state.vote}
                          approve={this.approve.bind(this)}
                          disapprove={this.disapprove.bind(this)}
                          address={this.props.address} />
                )
    }
}
