import React from 'react';
import { Form, Input, Container, Popup, Icon, Dropdown, Divider, Select } from 'semantic-ui-react';
import { PROPOSALPAYOUT, PROPOSALTYPE} from 'constants/validators';
import proposalType from 'constants/proposalType';

import currencyOptions from 'constants/currencyOptions';

export default class Organisational extends React.Component {

  render() {
    return (
      <Container text>
        <Divider section hidden />
        <Form>
          <Form.Field>
            <label>
              Set the payout amount
              <Popup
                trigger={<Icon name='help' color='grey' size='small' circular />}
                header='The amount of Ether you receive if your proposal was approved'
              />
            </label>
            <Input
              name={PROPOSALPAYOUT}
              id={PROPOSALPAYOUT}
              labelPosition='right'
              size='small'
            />
          </Form.Field>
          <Form.Field>
            <label>Type of proposal</label>
            <Select
                id={PROPOSALTYPE}
                name={PROPOSALTYPE}
                compact
                required
                options={proposalType}
                defaultValue="business"
            />
          </Form.Field>
        </Form>
        <Divider section hidden />
      </Container>
    );
  }
}
