import React from 'react';
import { Form, Input, Container, Popup, Icon, Dropdown } from 'semantic-ui-react';
import { dmrReward, financePoints, productPoints, orgPoints, partnerPoints } from 'constants/validators';
import validateDAOFieldsOfWork from '../../validators/DAOFieldsOfWork';

import currencyOptions from 'utils/currencyOptions'

export default class DAOFieldsOfWork extends React.Component {
  constructor(props) {
    super(props);
    // StepZilla requires `isValidated` to return true or false
    this.isValidated = validateDAOFieldsOfWork;
  }
  render() {
    return (
      <Container>
        <Form id="name-form">
          <Form.Field>
            <label>
              Set the DMR Reward
                    <Popup
                trigger={<Icon name='help' color='grey' size='small' circular />}
                content='Decisionmaker (DMR) is a shareholder who votes on a proposal'
                position='right center'
                />
            </label>
            <Input
              type="number"
              name={dmrReward}
              id={dmrReward}
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
                content='A Field of Work describes an area of expertise.'
                position='right center'
                />
            </label>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>
                  Finance
                            <Popup
                    trigger={<Icon name='help' color='grey' size='small' circular />}
                    content='Finance'
                    position='right center'
                    />
                </label>
                <Input
                  type="number"
                  name={financePoints}
                  id={financePoints}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                  />
              </Form.Field>
              <Form.Field>
                <label>
                  Product
                            <Popup
                    trigger={<Icon name='help' color='grey' size='small' circular />}
                    content='Product'
                    position='right center'
                    style={{ opacity: '0.9' }}
                    />
                </label>
                <Input
                  type="number"
                  name={productPoints}
                  id={productPoints}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                  />
              </Form.Field>
              <Form.Field>
                <label>
                  Organisation
                            <Popup
                    trigger={<Icon name='help' color='grey' size='small' circular />}
                    content='Organisation'
                    position='right center'
                    />
                </label>
                <Input
                  type="number"
                  name={orgPoints}
                  id={orgPoints}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                  />
              </Form.Field>
              <Form.Field>
                <label>
                  Partnership
                            <Popup
                    trigger={<Icon name='help' color='grey' size='small' circular />}
                    content='Partnership'
                    position='right center'
                    />
                </label>
                <Input
                  type="number"
                  name={partnerPoints}
                  id={partnerPoints}
                  label={{ basic: true, content: '%' }}
                  labelPosition='right'
                  size='small'
                  />
              </Form.Field>
            </Form.Group>
          </Form.Field>
        </Form>
      </Container>

    )
  }
}
