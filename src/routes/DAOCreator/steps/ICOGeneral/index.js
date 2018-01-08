import React, { Component } from 'react';
import { Form, Input, Container } from 'semantic-ui-react';
import { TOKENNAME, TICKERSYMBOL, TOTALSUPPLY, SALESTART, SALEEND } from 'constants/validators';
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
              name={TOKENNAME}
              id={TOKENNAME}
              size='small'
              />
          </Form.Field>
          <Form.Field>
            <label>What will be your ticker symbol?</label>
            <input
              type="text"
              name={TICKERSYMBOL}
              id={TICKERSYMBOL}
              size='small'
              />
          </Form.Field>
          <Form.Field>
            <label>How many tokens do you want to emmit?</label>
            <Input
              type="number"
              name={TOTALSUPPLY}
              id={TOTALSUPPLY}
              min='0'
              size='small'
              />
          </Form.Field>

          <Form.Field>
            <label>Time your ICO!</label>
            <Input
              type="date"
              name={SALESTART}
              id={SALESTART}
              size='small'
              />
            <Input
              type="date"
              name={SALEEND}
              id={SALEEND}
              size='small'
              />
          </Form.Field>
        </Form>
      </Container>
    )
  }

}
