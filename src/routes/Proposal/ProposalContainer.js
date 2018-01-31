import React from 'react';

import { loadProposal, loadVote, vote, executeProposal } from 'provider/ProposalProvider'

import Proposal from './Proposal';

export default class ProposalContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      proposal: {
          proposalNumber: "",
          recipient: "",
          amount: "",
          name: "",
          fieldOfWorkDescription: "",
          description: "",
          proposalDeadline: "",
          finished: "",
          stateDescription: "",
          proposalPassed: "",
          passedPercent: "",
          dividend: ""
      },
      vote: {
          support: "",
          voted: "",
          stateDescription: ""
      }
    }
  }

  async componentDidMount() {
    const proposal = await loadProposal(this.props.address, this.props.proposalNumber)
    proposal.amount = proposal.amount.toString(10)
    proposal.dividend = proposal.dividend.toString(10)
    proposal.passedPercent = proposal.passedPercent.toString(10)
    proposal.proposalDeadline = proposal.proposalDeadline.toString(10)
    proposal.approve = parseInt(proposal.approve.toString(10))
    proposal.disapprove = parseInt(proposal.disapprove.toString(10))
    proposal.percent = parseInt(proposal.percent.toString(10))
    switch (proposal.fieldOfWork.toString(10)) {
      case "0": proposal.fieldOfWorkDescription = "Finance"; break
      case "1": proposal.fieldOfWorkDescription = "Organisational"; break
      case "2": proposal.fieldOfWorkDescription = "Product"; break
      case "3": proposal.fieldOfWorkDescription = "Marketing"; break
      default: proposal.fieldOfWorkDescription = "Unknown"
    }
    if (!proposal.isFinished) {
      proposal.stateDescription = "Proposal pending"
    } else if (proposal.isFinished && !proposal.proposalPassed) {
      proposal.stateDescription = "Proposal rejected"
    } else if (proposal.isFinished && proposal.proposalPassed) {
      proposal.stateDescription = "Proposal passed"
    } else {
      proposal.stateDescription = "No information"
    }
    this.setState({proposal});

    const vote = await loadVote(this.props.address, proposal, this.props.account)
    if (vote.voted && vote.support) {
      vote.stateDescription = "You approved this proposal"
    } else if (vote.voted && !vote.support) {
      vote.stateDescription = "You disapproved this proposal"
    } else if (!vote.voted) {
      vote.stateDescription = "You did not vote on this proposal yet."
    } else {
      vote.stateDescription = "No information"
    }
    vote.influenceDescription = "Your influence in this field of work is " + vote.influence;
    this.setState({vote});
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
    return (
      <Proposal proposal={this.state.proposal}
                vote={this.state.vote}
                approveCallback={this.approveCallback.bind(this)}
                disapproveCallback={this.disapproveCallback.bind(this)}
                executeCallback={this.executeCallback.bind(this)}
                address={this.props.address} />
    )
  }
}
