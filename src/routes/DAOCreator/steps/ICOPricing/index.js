import React, { Component } from 'react';
import { Form, Input, Select, Container, Divider } from 'semantic-ui-react';
import { SELECTEDCURRENCY, STARTPRICE, ENDPRICE } from 'constants/validators';
import currencyOptions from 'constants/currencyOptions';
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
          <Form.Field>
            <label>Choose your Ethereum currency!</label>
            <Select
              id={SELECTEDCURRENCY}
              name={SELECTEDCURRENCY}
              compact
              options={currencyOptions}
              defaultValue="ether"
              required
            />
          </Form.Field>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Start price</label>
              <Input
                id={STARTPRICE}
                name={STARTPRICE}
                size="small"
              />
            </Form.Field>
            <Form.Field>
              <label>End price</label>
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
