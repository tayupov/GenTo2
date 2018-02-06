import React from 'react';

import { loadProposal, onVote, loadVote, vote, executeProposal } from 'provider/ProposalProvider'
import { isShareholder } from 'provider/DAOProvider'

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
      },
      executeAllowed: false,
      votingAllowed: false,
    }
  }

  async loadStateFromBlockchain() {
    const proposal = await loadProposal(this.props.address, this.props.proposalNumber)
    const isShareHolderOfDao = await isShareholder(this.props.address, this.props.account)

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
    
    var executeAllowed =  proposal.currentTime > proposal.proposalDeadline  && !proposal.finished && isShareHolderOfDao;
    var votingAllowed =  proposal.currentTime < proposal.proposalDeadline  && !proposal.finished && isShareHolderOfDao  && !vote.voted;
    console.log("aaaaaaaaaaaa")
    console.log(proposal.currentTime)
    console.log(proposal.proposalDeadline)
    this.setState({vote});
    this.setState({votingAllowed});
    this.setState({executeAllowed});
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({ loading: true })
    this.loadStateFromBlockchain()
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
    var res = await vote(this.props.address, this.props.proposalNumber,true, this.props.account)

    if(res === -1){
      this.props.notify("Vote failed. Please check deadline and priviliges.")
    }
    else {
      this.props.notify("Approval submitted. Check back later")
    }
  }

  async disapproveCallback(){
    var res = await vote(this.props.address, this.props.proposalNumber,false, this.props.account)

    if(res === -1){
      this.props.notify("Vote failed. Please check deadline and priviliges.")
    }
    else {
      this.props.notify("Disapproval submitted. Check back later")
    }
  }

  async executeCallback(){
    var res = await executeProposal(this.props.address, this.props.proposalNumber)

    if(res === -1){
      this.props.notify("Execution failed. Please check deadline, status and priviliges.")
    }
    else {
      this.props.notify("Execute submitted. Check back later")
    }
  }

  render() {
    return (
      <Proposal proposal={this.state.proposal}
                vote={this.state.vote}
                executeAllowed={this.state.executeAllowed}
                votingAllowed={this.state.votingAllowed}
                approveCallback={this.approveCallback.bind(this)}
                disapproveCallback={this.disapproveCallback.bind(this)}
                executeCallback={this.executeCallback.bind(this)}
                address={this.props.address} />
    )
  }
}
