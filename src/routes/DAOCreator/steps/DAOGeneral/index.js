import React, { Component } from 'react';
import { Form, Input, TextArea, Container, Divider } from 'semantic-ui-react';
import { DAONAME, DAOWEBSITE, DAODESCRIPTION, DAOPROPOSAL } from 'constants/validators';
import validateDAOGeneral from '../../validators/DAOGeneral';

export default class DAOGeneral extends Component {

  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateDAOGeneral;
  }

  render() {
    return (
      <Container text>
        <Divider section hidden />
        <Form>
          <Form.Field>
            <label>Give your DAO a name</label>
            <Input type="text" name={DAONAME} id ={DAONAME} size='small'/>
          </Form.Field>
          
          <Form.Field>
            <label>Enter a URL to your webpage</label>
            <Input type="text" label='http://' name={DAOWEBSITE} id={DAOWEBSITE} size='small'/>
          </Form.Field>

          <Form.Field>
            <label>Describe the primary goal of your DAO</label>
            <TextArea type="text-area" name={DAODESCRIPTION} id={DAODESCRIPTION} size='small'/>
          </Form.Field>

          <Form.Field>
            <label>File upload</label>
            <Input type="file" name={DAOPROPOSAL} id={DAOPROPOSAL} size='small' />
          </Form.Field>
        </Form>
        <Divider section hidden />
      </Container>
    )
  }
}
