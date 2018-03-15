import React from 'react';
import Proposal from './Proposal';

import { loadOrganization, isShareholder } from 'provider/DAOProvider'
import { loadProposal, onVote, loadVote, vote, executeProposal } from 'provider/ProposalProvider'

export default class ProposalContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      dao: {
        claimPayout: null
      },
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
    const dao = await loadOrganization(this.props.address, this.props.account, true)
    this.setState({ dao: { claimPayout: dao.claimProposalPayout } })

    const proposal = await loadProposal(this.props.address, this.props.proposalNumber)
    const isShareHolderOfDao = await isShareholder(this.props.address, this.props.account)
    const vote = await loadVote(this.props.address, proposal, this.props.account)

    var executeAllowed = proposal.currentTime > proposal.proposalDeadline && !proposal.finished && isShareHolderOfDao;
    var votingAllowed = proposal.currentTime < proposal.proposalDeadline && !proposal.finished && isShareHolderOfDao && !vote.voted;


    switch (proposal.fieldOfWork) {
      case 0: proposal.fieldOfWorkDescription = "Finance"; break
      case 1: proposal.fieldOfWorkDescription = "Organisational"; break
      case 2: proposal.fieldOfWorkDescription = "Product"; break
      case 3: proposal.fieldOfWorkDescription = "Partnership"; break
      default: proposal.fieldOfWorkDescription = "Unknown"
    }

    if (proposal.dividend > 0) {
      proposal.proposalType = "Dividend proposal"
    } else if (proposal.dmr > 0) {
      proposal.proposalType = "Dmr proposal"
    } else {
      proposal.proposalType = "Business proposal";
    }

    if (executeAllowed) {
      proposal.stateDescription = "Waiting for execution"
    } else if (proposal.finished && !proposal.proposalPassed) {
      proposal.stateDescription = "Proposal rejected"
    } else if (proposal.finished && proposal.proposalPassed) {
      proposal.stateDescription = "Proposal passed"
    } else if (!proposal.finished) {
      proposal.stateDescription = "Proposal pending"
    } else {
      proposal.stateDescription = "Unknown"
    }
    this.setState({ proposal });


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

    this.setState({ vote });
    this.setState({ votingAllowed });
    this.setState({ executeAllowed });
  }
  async componentDidMount() {
    this.loadStateFromBlockchain()
    onVote(this.props.address, this.props.proposalNumber, (err, eventData) => {
      this.loadStateFromBlockchain()
      console.log("onVote", eventData)
      //TODO UX People: It would be lovely if a popup would show up indicating that somebody just voted
    })
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({ loading: true })
    this.loadStateFromBlockchain()
  }

  async componentDidMount() {
    this.loadStateFromBlockchain()
    onVote(this.props.address, this.props.proposalNumber, (err, eventData) => {
      this.loadStateFromBlockchain()
      //TODO UX People: It would be lovely if a popup would show up indicating that somebody just voted
    })
  }

  async approveCallback() {
    var res = await vote(this.props.address, this.props.proposalNumber, true, this.props.account)

    if (res === -1) {
      this.props.notify("Vote failed. Please check deadline and priviliges.")
    }
    else {
      this.props.notify("Approval submitted. Check back later")
    }
  }

  async disapproveCallback() {
    var res = await vote(this.props.address, this.props.proposalNumber, false, this.props.account)

    if (res === -1) {
      this.props.notify("Vote failed. Please check deadline and priviliges.")
    }
    else {
      this.props.notify("Disapproval submitted. Check back later")
    }
  }

  async executeCallback() {
    var res = await executeProposal(this.props.address, this.props.proposalNumber, this.props.account)

    if (res === -1) {
      this.props.notify("Execution failed. Please check deadline, status and priviliges.")
    }
    else {
      this.props.notify("Execute submitted. Check back later")
    }
  }

  async claimPayout(event, element) {
    const from = this.props.account
    const proposal = element.proposal
    const claimPayout = this.state.dao.claimPayout
    const res = await claimPayout(proposal.proposalNumber, { from })
    console.log(res)
  }

  render() {
    return (
      <Proposal
        account={this.props.account}
        proposal={this.state.proposal}
        vote={this.state.vote}
        executeAllowed={this.state.executeAllowed}
        votingAllowed={this.state.votingAllowed}
        claimPayout={this.claimPayout.bind(this)}
        approveCallback={this.approveCallback.bind(this)}
        disapproveCallback={this.disapproveCallback.bind(this)}
        executeCallback={this.executeCallback.bind(this)}
        address={this.props.address} />
    )
  }
}
