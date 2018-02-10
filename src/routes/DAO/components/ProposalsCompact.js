import React from 'react'
import { Link } from 'react-router-dom'
import { List, Header, Divider } from 'semantic-ui-react'

export default class Delegation extends React.Component {
  render() {
    
    const address = this.props.address
    const proposals = this.props.proposals
    const proposalLimit = 3

    return (
      <List relaxed selection>
        <Header as={Link} to={{ pathname: `/dao/${address}/proposals` }}>
          <u>Proposals</u>
        </Header>
        <Divider hidden />
        {proposals.length > 0 &&
          proposals.slice(0, proposalLimit).map((proposal, index) =>
            <List.Item
              key={index}
              as={Link}
              to={{ pathname: `/dao/${address}/proposals/${proposal.proposalNumber}` }}
            >
              <List.Header>{proposal.name}</List.Header>
            </List.Item>
          )
        }
        {proposals.length >= proposalLimit &&
          <List.Item as={Link} to={{ pathname: `/dao/${address}/proposals` }}>More...</List.Item>
        }
      </List>
    )
  }
}