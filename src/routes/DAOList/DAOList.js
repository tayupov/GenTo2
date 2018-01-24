import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, Tab } from 'semantic-ui-react';

export default class DAOList extends React.Component {
  render() {
    const { gentoDAOs, gentoICOs } = this.props
    const panes = [
      { menuItem: 'ICOs', render: () => <Tab.Pane>{renderTabPane(gentoICOs)}</Tab.Pane> },
      { menuItem: 'DAOs', render: () => <Tab.Pane>{renderTabPane(gentoDAOs)}</Tab.Pane> }
    ]

    return (
      <div>
      <h1>All GenTo ICOs and DAOs</h1>
      <Divider section hidden />
      <Tab panes= {panes} />
      </div>
    )
  }
}

function renderTabPane(gentoOrganizations) {
  return (
    <Card.Group>
      {gentoOrganizations.map((org, index) => {
        return (
          <Card as={Link} to={{ pathname: `/dao/${org.address}` }} key={index}>
            <Card.Content>
              <Card.Header> {org.name} </Card.Header>
              <Card.Meta> {org.symbol} </Card.Meta>
            </Card.Content>
            <Card.Content description = {"Number Of Proposals: " + org.numberOfProposals.c} />
            <Card.Content description = {"Sale from " + org.saleStart + " to " + org.saleEnd} />
          </Card>
        )
      })}
    </Card.Group>
  )
}
