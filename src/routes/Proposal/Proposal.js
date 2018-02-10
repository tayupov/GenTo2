import React from 'react';
import { Button, Divider, Table, Message, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

export default class Proposal extends React.Component {
  render() {
    const { proposal, vote } = this.props;
    const { executeAllowed, votingAllowed } = this.props
    const { claimPayout, approveCallback, disapproveCallback, executeCallback } = this.props;
    
    let canClaim =
        !proposal.claimed &&
        proposal.finished &&
        proposal.proposalPassed &&
        (proposal.recipient === this.props.account)


    return (
      <div>
        <Button
            as={Link} to={{ pathname: `/dao/${this.props.address}/proposals` }}
        >Back to proposal list</Button>

        <h1>Information on proposal: {proposal.name}</h1>
        <Divider section hidden />
        {executeAllowed ? <Button onClick={executeCallback} content="Execute" /> : null}
        {votingAllowed ? <Button onClick={approveCallback} content="Approve" /> : null}
        {votingAllowed ? <Button onClick={disapproveCallback} content="Disapprove" /> : null}
        {canClaim &&
          <Button proposal={proposal} onClick={claimPayout} content={`Claim: ${proposal.amount} Ether`} />
        }
        <h3>{vote.stateDescription}</h3>
        <h3>{vote.influenceDescription}</h3>
        <Divider section hidden />

        <Message>
          <Message.Header>Proposal Description:</Message.Header>
          <ReactMarkdown source={proposal.description} />
        </Message>

        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Proposal type</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.proposalType}</Label>
              </Table.Cell>
            </Table.Row>
            {proposal.dividend > 0 ? <Table.Row>
              <Table.Cell>
                <Label size='large'>Proposed dividend</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.dividend} Ether</Label>
              </Table.Cell>
            </Table.Row> : null}
            {proposal.dmr > 0 ? <Table.Row>
              <Table.Cell>
                <Label size='large'>Proposed dmr</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.dmr} Ether</Label>
              </Table.Cell>
            </Table.Row> : null}
            {proposal.amount ? <Table.Row>
              <Table.Cell>
                <Label size='large'>Ether transferred to Recipient when finished</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.amount} Ether</Label>
              </Table.Cell>
            </Table.Row> : null}
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Recipient Address</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.recipient}</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Deadline of Proposal</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.proposalDeadlineFormatted}</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Proposal State</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.stateDescription}</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Voters currently approving the Proposal</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.approve}/{proposal.approve + proposal.disapprove} ({proposal.percent}%)</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Field of Work</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.fieldOfWorkDescription}</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Dividend for Voting</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.dividend} Wei</Label>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    )
  }
}
