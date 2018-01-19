import React, { Component } from 'react';
import { Form, Input, Container, Divider } from 'semantic-ui-react';
import { TOKENNAME, SYMBOL, TOTALSUPPLY, SALESTART, SALEEND } from 'constants/validators';
import validateICOGeneral from '../../validators/ICOGeneral';

export default class ICOGeneral extends Component {
  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateICOGeneral;
  }
  render() {
    return (
      <Container text>
        <Divider section hidden />
        <Form>
          <Form.Field>
            <label>How shall your Token be named?</label>
            <Input type="text" name={TOKENNAME} id={TOKENNAME} size='small' />
          </Form.Field>
          <Form.Field>
            <label>What will be your ticker symbol?</label>
            <input type="text" name={SYMBOL} id={SYMBOL} size='small' />
          </Form.Field>
          <Form.Field>
            <label>How many tokens do you want to emmit?</label>
            <Input
              defaultValue="1000000000000000000"
              name={TOTALSUPPLY}
              id={TOTALSUPPLY}
              min='0'
              size='small'
            />
          </Form.Field>
          <Form.Group widths='equal'>
            <Form.Field>
            <label>ICO start date</label>
              <Input
                type="date"
                name={SALESTART}
                id={SALESTART}
                size='small'
              />
            </Form.Field>
            <Form.Field>
              <label>ICO end date</label>
              <Input
                type="date"
                name={SALEEND}
                id={SALEEND}
                size='small'
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Divider section hidden />
      </Container>
    )
  }
}
