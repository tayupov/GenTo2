import React, { Component } from 'react';
import { Container, Form, Input } from 'semantic-ui-react';
import { MINPARTIC, DECIDINGPERCENTAGE } from 'constants/validators';
import validateDAOVoting from '../../validators/DAOVoting';

export default class DAOVoting extends Component {

  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateDAOVoting;
  }

  render() {
    return (
      <Container>
        <Form id="name-form">
          <Form.Field>
            <label>Set the participation minimum</label>
            <Input
              type="number"
              name={MINPARTIC}
              id={MINPARTIC}
              label={{ basic: true, content: '%' }}
              labelPosition='right'
              size='small'
              />
          </Form.Field>
          <Form.Field>
            <label>Set the deciding percentage</label>
            <Input
              type="number"
              name={DECIDINGPERCENTAGE}
              id={DECIDINGPERCENTAGE}
              label={{ basic: true, content: '%' }}
              labelPosition='right'
              size='small'
              />
          </Form.Field>
        </Form>
      </Container>
    )
  }

}
