import React from 'react';
import { Button, Divider, Table, Message, Label } from 'semantic-ui-react';

import { loadProposal } from 'provider/ProposalProvider'

export default class Proposal extends React.Component {
  render() {
    const { proposal, vote } = this.props;
    const { approveCallback, disapproveCallback,executeCallback}= this.props;
    return (
      <div>
        <h1>Information on proposal: {proposal.name}</h1>
        <Divider section hidden />
        <Button onClick={approveCallback} content="Approve" />
        <Button onClick={disapproveCallback} content="Disapprove" />
        <Button onClick={executeCallback} content="Execute" />
        <h3>{vote.stateDescription}</h3>
        <h3>{vote.influenceDescription}</h3>
        <Divider section hidden />
        
        <Message>
          <Message.Header>Proposal Description:</Message.Header>
          <p> {proposal.description} </p>
        </Message>

        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Label size='large'>Tokens transferred to Recipient when finished</Label>
              </Table.Cell>
              <Table.Cell>
                <Label size='large'>{proposal.amount} Wei</Label>
              </Table.Cell>
            </Table.Row>
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
                <Label size='large'>{proposal.proposalDeadline}</Label>
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
                <Label size='large'>{proposal.approve}/{proposal.approve+proposal.disapprove} ({proposal.percent}%)</Label>
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
