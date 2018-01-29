import React from 'react';

import { Link } from 'react-router-dom';
import { Button} from 'semantic-ui-react';

import { loadProposal } from 'provider/ProposalProvider'

export default class Proposal extends React.Component {


    constructor() {
        super();
    }

    render() {
        const { proposal, vote } = this.props;
        const { approveCallback, disapproveCallback,executeCallback}= this.props;
        return (
        <div>
            <h1>{proposal.name}</h1>
            <h2>description: {proposal.description}</h2>
            <h2>amount: {proposal.amount}</h2>
            <h2>recipient: {proposal.recipient}</h2>
            <h2>proposalDeadline: {proposal.proposalDeadline}</h2>
            <h2>finished: {proposal.finished}</h2>
            <h2>proposalPassed: {proposal.proposalPassed}</h2>
            <h2>passedPercent: {proposal.passedPercent}</h2>
            <h2>dividend: {proposal.dividend}</h2>
            <h2>this user voted: {String(vote.voted)}</h2>
            <h2>support from this user: {String(vote.support)}</h2>
            <Button  onClick={approveCallback} content="Approve" />
            <Button  onClick={disapproveCallback} content="Disapprove" />
            <Button  onClick={executeCallback} content="Execute" />
        </div>)
    }
}
