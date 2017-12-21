import React, { Component } from 'react';
import { Form, Input, Container } from 'semantic-ui-react';
import { tokenName, tickerSymbol, totalSupply, saleStart, saleEnd } from 'constants/validators';
import validateICOGeneral from '../../validators/ICOGeneral';

export default class ICOGeneral extends Component {

  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateICOGeneral;
  }

  render() {
    return (
      <Container>
        <Form id="name-form">
          <Form.Field>
            <label>How shall your Token be named?</label>
            <Input
              type="text"
              name={tokenName}
              id={tokenName}
              size='small'
              />
          </Form.Field>
          <Form.Field>
            <label>What will be your ticker symbol?</label>
            <input
              type="text"
              name={tickerSymbol}
              id={tickerSymbol}
              size='small'
              />
          </Form.Field>
          <Form.Field>
            <label>How many tokens do you want to emmit?</label>
            <Input
              type="number"
              name={totalSupply}
              id={totalSupply}
              min='0'
              size='small'
              />
          </Form.Field>

          <Form.Field>
            <label>Time your ICO!</label>
            <Input
              type="date"
              name={saleStart}
              id={saleStart}
              size='small'
              />
            <Input
              type="date"
              name={saleEnd}
              id={saleEnd}
              size='small'
              />
          </Form.Field>
        </Form>
      </Container>
    )
  }

}
