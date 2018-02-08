import React from 'react'
import { Table, Input } from 'semantic-ui-react'

import fieldsOfWork from 'constants/fieldsOfWork'

const DID_NOT_DELEGATE_ADDRESS = '0x0000000000000000000000000000000000000000'

export default class Delegation extends React.Component {
  render() {
    const account = this.props.account
    const delegate = this.props.delegate
    const delegationsForAccount = this.props.delegationsForAccount
    return (
      <Table compact basic='very'>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Delegatee</Table.HeaderCell>
            <Table.HeaderCell>Influence</Table.HeaderCell>
            <Table.HeaderCell>Field Of Work</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {delegationsForAccount.map((delegation, index) => {
            const hasDelegated =
              (delegation.delegationAddress !== account) &&
              (delegation.delegationAddress !== DID_NOT_DELEGATE_ADDRESS)
            const placeholder = delegation.delegationAddress === DID_NOT_DELEGATE_ADDRESS ?
              account : delegation.delegationAddress
            return (
              <Table.Row key={index}>
                <Table.Cell selectable>
                  <Input
                    fluid
                    placeholder={placeholder}
                    className='delegatee'
                    fieldofwork={index}
                    onChange={(e, data) => delegate(e, data)}
                  />
                </Table.Cell>
                <Table.Cell collapsing>{hasDelegated ? 0 : delegation.influence}</Table.Cell>
                <Table.Cell collapsing>{fieldsOfWork.find(fow => fow.value === index).text}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>

      </Table>
    )
  }
}