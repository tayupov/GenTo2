import React from 'react';

import { loadProposal, onVote, loadVote, vote, executeProposal } from 'provider/ProposalProvider'

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
  async loadStateFromBlockchain() {
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
  async componentDidMount() {
    this.loadStateFromBlockchain()
    onVote(this.props.address, this.props.proposalNumber, (err, eventData) => {
      this.loadStateFromBlockchain()
      console.log("onVote", eventData)
      //TODO UX People: It would be lovely if a popup would show up indicating that somebody just voted
    })
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
