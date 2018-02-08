import React from 'react'
import { Table, Input } from 'semantic-ui-react'

import fieldsOfWork from 'constants/fieldsOfWork'

export default class Delegation extends React.Component {
  render() {
    const delegate = this.props.delegate
    const delegations = this.props.delegations
    return (
      <Table compact basic='very'>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Delegatee</Table.HeaderCell>
            <Table.HeaderCell>Field Of Work</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {delegations.map((delegation, index) =>
            <Table.Row key={index}>
              <Table.Cell selectable>
                <Input
                  fluid
                  className='delegatee'
                  placeholder={delegation}
                  fieldofwork={index}
                  onChange={(e, data) => delegate(e, data)}
                />
              </Table.Cell>
              <Table.Cell collapsing>{fieldsOfWork.find(fow => fow.value === index).text}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>

      </Table>
    )
  }
}