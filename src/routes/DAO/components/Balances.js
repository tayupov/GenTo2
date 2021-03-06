import React from 'react'
import { Table } from 'semantic-ui-react'

export default class Balances extends React.Component {
  render() {
    const { balanceForAccount, totalNumberOfTokens, balance } = this.props
    return (
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>My Tokens</Table.Cell><Table.Cell>{balanceForAccount}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Total Tokens</Table.Cell><Table.Cell>{totalNumberOfTokens}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>DAO Balance</Table.Cell><Table.Cell>{balance} finney</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}
