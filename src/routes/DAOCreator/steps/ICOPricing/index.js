import React, { Component } from 'react';
import { Form, Input, Container, Divider } from 'semantic-ui-react';
import { STARTPRICE, ENDPRICE } from 'constants/validators';
import validateICOPricing from '../../validators/ICOPricing';

export default class ICOPricing extends Component {
  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateICOPricing;
  }
  render() {
    return (
      <Container text>
        <Divider section hidden />
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Start price in Finney</label>
              <Input
                id={STARTPRICE}
                name={STARTPRICE}
                size="small"
              />
            </Form.Field>
            <Form.Field>
              <label>End price in Finney</label>
              <Input
                id={ENDPRICE}
                name={ENDPRICE}
                size="small"
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Divider section hidden />
      </Container>
    )
  }
}
