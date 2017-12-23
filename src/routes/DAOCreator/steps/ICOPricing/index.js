import React, { Component } from 'react';
import { Form, Input, Select, Container } from 'semantic-ui-react';
import { selectedCurrency, startPrice, endPrice } from 'constants/validators';
import currencyOptions from 'utils/currencyOptions';
import validateICOPricing from '../../validators/ICOPricing';

export default class ICOPricing extends Component {

  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateICOPricing;
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <Container>
        <Form id="name-form">
          <Form.Field>
            <label>Choose your Ethereum currency!</label>
            <Select
              id={selectedCurrency}
              name={selectedCurrency}
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
              name={startPrice}
              label="START"
              labelPosition="left"
              id={startPrice}
              size="small"
              />
            <Input
              type="number"
              name={endPrice}
              label="END"
              labelPosition="right"
              id={endPrice}
              size="small"
              />
          </Form.Field>
        </Form>
      </Container>
    )
  }
}
