import React from 'react';
import { Form, Input, Container, Popup, Icon, Dropdown, Divider } from 'semantic-ui-react';
import { DMRREWARD, FINANCEPOINTS, PRODUCTPOINTS, ORGPOINTS, PARTNERPOINTS } from 'constants/validators';
import validateDAOFieldsOfWork from '../../validators/DAOFieldsOfWork';

import currencyOptions from 'constants/currencyOptions'

export default class DAOFieldsOfWork extends React.Component {
  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateDAOFieldsOfWork;
  }
  render() {
    return (
      <Container text>
        <Divider section hidden />
        <Form>
          <Form.Field>
            <label>
              Set the DMR Reward
              <Popup
                trigger={<Icon name='help' color='grey' size='small' circular />}
                header='Decisionmaker (DMR) is a shareholder who votes on a proposal'
              />
            </label>
            <Input
              name={DMRREWARD}
              id={DMRREWARD}
              label={<Dropdown defaultValue='finney' options={currencyOptions} />}
              labelPosition='right'
              size='small'
            />
          </Form.Field>
          <Form.Field>
            <label>
              Distribute the DMR between the Fields of Work
              <Popup
                trigger={<Icon name='help' color='grey' size='small' circular />}
                header='A Field of Work describes an area of expertise.'
              />
            </label>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Finance</label>
                <Input
                  defaultValue="25"
                  name={FINANCEPOINTS}
                  id={FINANCEPOINTS}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                />
              </Form.Field>
              <Form.Field>
                <label>Product</label>
                <Input
                  defaultValue="25"
                  name={PRODUCTPOINTS}
                  id={PRODUCTPOINTS}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Organisation</label>
                <Input
                  defaultValue="25"
                  name={ORGPOINTS}
                  id={ORGPOINTS}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                />
              </Form.Field>
              <Form.Field>
                <label>Partnership</label>
                <Input
                  defaultValue="25"
                  name={PARTNERPOINTS}
                  id={PARTNERPOINTS}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                />
              </Form.Field>
            </Form.Group>
          </Form.Field>
        </Form>
        <Divider section hidden />
      </Container>
    )
  }
}
