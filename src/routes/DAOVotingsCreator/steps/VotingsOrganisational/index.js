import React, { Component } from 'react';
import { Form, Input, Container, Popup, Icon, Dropdown, Divider } from 'semantic-ui-react';
import { VOTINGPAYOUT, VOTINGEND } from 'constants/validators';

import currencyOptions from 'constants/currencyOptions';

export default class Organisational extends React.Component {
  constructor(props) {
    super(props);
  }

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
                header='The amount of Ether you receive if your voting was approved'
              />
            </label>
            <Input
              name={VOTINGPAYOUT}
              id={VOTINGPAYOUT}
              label={<Dropdown defaultValue='finney' options={currencyOptions} />}
              labelPosition='right'
              size='small'
            />
          </Form.Field>
          <Form.Field>
            <label>How long should the voting last?</label>
            <Input
              type="date"
              name={VOTINGEND}
              id={VOTINGEND}
              size='small'
            />
          </Form.Field>
        </Form>
        <Divider section hidden />
      </Container>
    );
  }
}
