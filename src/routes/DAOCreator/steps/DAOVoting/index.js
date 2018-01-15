import React, { Component } from 'react';
import { Container, Form, Input, Icon, Popup, Divider } from 'semantic-ui-react';
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
      <Container text>
        <Divider section hidden />
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>
                Set the participation minimum
                <Popup
                  trigger={<Icon name='help' color='grey' size='small' circular />}
                  header='Ratio of tokenholders that must participate for the voting to be valid (quorum)'
                />
              </label>
              <Input
                defaultValue="15"
                name={MINPARTIC}
                id={MINPARTIC}
                label={{ basic: true, content: '%' }}
                labelPosition='right'
                size='small'
              />
            </Form.Field>
            <Form.Field>
              <label>
                Set the deciding percentage
                <Popup
                  trigger={<Icon name='help' color='grey' size='small' circular />}
                  header='Ratio of approval votes needed to approve the voting'
                />
              </label>
              <Input
                defaultValue="50"
                name={DECIDINGPERCENTAGE}
                id={DECIDINGPERCENTAGE}
                label={{ basic: true, content: '%' }}
                labelPosition='right'
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
