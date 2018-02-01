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

    switch (proposal.fieldOfWork) {
      case 0: proposal.fieldOfWorkDescription = "Finance"; break
      case 1: proposal.fieldOfWorkDescription = "Organisational"; break
      case 2: proposal.fieldOfWorkDescription = "Product"; break
      case 3: proposal.fieldOfWorkDescription = "Marketing"; break
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
    var res = await vote(this.props.address, this.props.proposalNumber,true, this.props.account)

    if(res === -1){
      this.props.notify("Vote failed. Please check deadline and priviliges.")
    }
  }

  async disapproveCallback(){
    var res = await vote(this.props.address, this.props.proposalNumber,false, this.props.account)

    if(res === -1){
      this.props.notify("Vote failed. Please check deadline and priviliges.")
    }
  }

  async executeCallback(){
    var res = await executeProposal(this.props.address, this.props.proposalNumber)

    if(res === -1){
      this.props.notify("Execution failed. Please check deadline, status and priviliges.")
    }
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
