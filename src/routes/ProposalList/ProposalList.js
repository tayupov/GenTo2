import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';

export default class ProposalList extends React.Component {
  render() {
    const { proposals, activeProposals, executedProposals } = this.props;
    return (
        <div>
            <Card.Group>
                <Card
                    as={Link}
                    to={{ pathname: `proposals/create` }}
                    key={`proposals/create`}
                >
                    <Card.Content>
                        <Card.Header>{`New Proposal`}</Card.Header>
                        <Card.Description>
                            <Icon name="add square" />
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Card.Group>
          <h2>Active proposals</h2>
          <Card.Group>
            {activeProposals.map((proposal, index) => {
              return (
                <Card
                  as={Link}
                  to={{ pathname: `proposals/${proposal.proposalNumber}` }}
                  key={index}
                >
                  <Card.Content>
                    <Card.Header>{proposal.name}</Card.Header>
                    <Card.Description>{proposal.description}</Card.Description>
                    <Card.Description>Deadline: {proposal.proposalDeadlineFormatted}</Card.Description>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
          <h2>Executed Proposals</h2>
          <Card.Group>
            {executedProposals.map((proposal, index) => {
              return (
                <Card
                  as={Link}
                  to={{ pathname: `proposals/${proposal.proposalNumber}` }}
                  key={index}
                >
                  <Card.Content>
                    <Card.Header>{proposal.name}</Card.Header>
                    <Card.Description>{proposal.description}</Card.Description>
                    <Card.Description>Deadline: {proposal.proposalDeadlineFormatted}</Card.Description>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </div>
    );
  }
}
