import React from 'react'
import { Table } from 'semantic-ui-react'

export default class Balances extends React.Component {
  render() {
    const { balanceForAccount, totalNumberOfTokens } = this.props
    return (
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Token</Table.Cell><Table.Cell>{balanceForAccount}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Total Token</Table.Cell><Table.Cell>{totalNumberOfTokens}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}
