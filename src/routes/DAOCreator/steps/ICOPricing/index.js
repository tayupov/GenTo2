import React, { Component } from 'react';
import { Form, Input, Select, Container } from 'semantic-ui-react';
import { SELECTEDCURRENCY, STARTPRICE, ENDPRICE } from 'constants/validators';
import currencyOptions from 'utils/currencyOptions';
import validateICOPricing from '../../validators/ICOPricing';

export default class ICOPricing extends Component {

  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateICOPricing;
  }

  render() {
    return (
      <Container>
        <Form id="name-form">
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
          <Form.Field>
            <label>Choose your START and END price!</label>
            <Input
              type="number"
              id={STARTPRICE}
              name={STARTPRICE}
              label="START"
              labelPosition="left"
              size="small"
              />
            <Input
              type="number"
              id={ENDPRICE}
              name={ENDPRICE}
              label="END"
              labelPosition="right"
              size="small"
              />
          </Form.Field>
        </Form>
      </Container>
    )
  }
}
