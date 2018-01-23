import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';

export default class DAOList extends React.Component {
  render() {
    console.log(this.props)
    const { gentoOrganizations } = this.props
    return (
      <Card.Group>
        {gentoOrganizations.map((org, index) => {
          return (
            <Card as={Link} to={{ pathname: `/dao/${org.address}` }} key={index}>
              <Card.Content>
                <Card.Header>
                  {org.name} <h5>{org.symbol}</h5>
                </Card.Header>
                <Card.Description>
                  ICO finished {org.isICOFinished}<br/>
                  Number Of Proposals {org.numberOfProposals.c}<br/>
                  Sale Start {org.saleStart.c}<br/>
                  Sale End {org.saleEnd.c}<br/>
                </Card.Description>
              </Card.Content>
            </Card>
          )
        })}
      </Card.Group>
    )
  }
}
