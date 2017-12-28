import React, { Component } from 'react';
import { Form, Input, TextArea, Container } from 'semantic-ui-react';
import { DAONAME, DAOWEBSITE, DAODESCRIPTION } from 'constants/validators';
import validateDAOGeneral from '../../validators/DAOGeneral';

export default class DAOGeneral extends Component {

  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateDAOGeneral;
  }

  render() {
    return (
      <Container>
        <Form id="name-form">
          <Form.Field>
            <label>Give your DAO a name</label>
            <Input
              type="text"
              name={DAONAME}
              id ={DAONAME}
              size='small'
              />
          </Form.Field>

          <Form.Field>
            <label>Enter a URL to your Webpage</label>
            <Input
              type="text"
              name={DAOWEBSITE}
              id={DAOWEBSITE}
              size='small'
              />
          </Form.Field>

          <Form.Field>
            <label>Describe the primary goal of your DAO</label>
            <TextArea
              type="text-area"
              name={DAODESCRIPTION}
              id={DAODESCRIPTION}
              size='small'
              />
          </Form.Field>
        </Form>
      </Container>
    )
  }
}
