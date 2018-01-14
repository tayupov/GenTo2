import React, { Component } from 'react';

import { Form, Input, Container, Popup, Icon, Dropdown } from 'semantic-ui-react';
import { VOTINGPAYOUT, VOTINGEND } from 'constants/validators';

import currencyOptions from 'constants/currencyOptions';

export default class Organisational extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Container>
        <Form id="name-form" action=''>
          <Form.Field>
            <label>
              Set the payout amount
                <Popup
                trigger={<Icon name='help' color='grey' size='small' circular />}
                content='Payout amount is the amount of Ether you get if your Voting is successful'
                position='right center'
              />
            </label>
            <Input
              type="number"
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
      </Container>
    );
  }

}
