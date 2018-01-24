import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider } from 'semantic-ui-react';

export default class DAOList extends React.Component {
  render() {
    console.log(this.props)
    const { gentoOrganizations } = this.props
    return (
      <div>
      <h1>All GenTo DAOs</h1>
      <Divider section hidden />
      <Card.Group>
        {gentoOrganizations.map((org, index) => {
          return (
            <Card as={Link} to={{ pathname: `/dao/${org.address}` }} key={index}>
                <Card.Content>
                  <Card.Header> {org.name} </Card.Header>
                  <Card.Meta> {org.symbol} </Card.Meta>
                </Card.Content>
                <Card.Content description = {org.isICOFinished} />
                <Card.Content description = {"Number Of Proposals: " + org.numberOfProposals.c} />
                <Card.Content description = {"Sale from " + org.saleStart + " to " + org.saleEnd} />
            </Card>
          )
        })}
      </Card.Group>
      </div>
    )
  }
}
