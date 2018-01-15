import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';

export default class ProposalList extends React.Component {
    render() {
        const { proposals } = this.props
        return (
            <Card.Group>
                {proposals.map((proposal, index) => {
                    return (
                        <Card as={Link} to={{ pathname: `proposals/${proposal.address}` }} key={index}>
                            <Card.Content>
                                <Card.Header>
                                    {proposal.name}
                                </Card.Header>
                                <Card.Description>
                                    {proposal.description}
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    )
                })}
                <Card as={Link} to={{ pathname: `proposals/create` }} key={`proposals/create`}>
                    <Card.Content>
                        <Card.Header>
                            {`New Proposal`}
                        </Card.Header>
                        <Card.Description>
                            <Icon name="add square" />
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Card.Group>
        )
    }
}
