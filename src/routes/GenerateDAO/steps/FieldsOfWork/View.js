import React from 'react';

import { Form, Input, TextArea, Container, Popup, Icon, Dropdown } from 'semantic-ui-react';

import InlineError from 'components/InlineError';

const styles = {
  root: {
    marginBottom: '1em'
  },
  firstLabel: {
    fontSize: '18px',
    marginTop: '3em',
    marginBottom: '0.8em',
    fontWeight: '300'
  },
  label: {
    fontSize: '18px',
    marginBottom: '1em',
    fontWeight: '300'
  },
  input: {
    width: '150px'
  }
}

const options = [
    { key: 'kether', text: 'kether', value: 'kether' },
    { key: 'ether', text: 'ether', value: 'ether' },
    { key: 'finney', text: 'finney', value: 'finney' },
    { key: 'gwei', text: 'gwei', value: 'gwei' },
    { key: 'mwei', text: 'mwei', value: 'mwei' },
  ]

const View = ({
    onChange, onChangeSelect, data, errors
}) => (
    <Container style={styles.root}>
        <Form id="name-form">
            <Form.Field error={!!errors.dmrReward}>
                <label style={styles.firstLabel}>
                Set the DMR Reward
                    <Popup
                        trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                        content='Decisionmaker (DMR) is a shareholder who votes on a proposal'
                        position='right center'
                        style={{ opacity: '0.6' }}
                    />
                </label>
                <Input
                    type="number"
                    name="dmrReward"
                    id="dmrReward"
                    label={<Dropdown defaultValue='finney' options={options} onChange={onChangeSelect} />}
                    labelPosition='right'
                    onChange={onChange}
                    size='small'
                    style={styles.input}
                    value={data.dmrReward}
                />
            </Form.Field>
            {errors.dmrReward && <InlineError text={errors.dmrReward} />}
            <Form.Field>
                <label style={styles.label}>
                Distribute the DMR between the Fields of Work
                    <Popup
                        trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                        content='A Field of Work describes an area of expertise.'
                        position='right center'
                        style={{ opacity: '0.6' }}
                    />
                </label>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>
                        Finance
                            <Popup
                                trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                                content='Finance'
                                position='right center'
                                style={{ opacity: '0.9' }}
                            /> 
                        </label>
                        <Input
                            type="number"
                            name="financePoints"
                            id="financePoints"
                            label={{ basic: true, content: '%' }}
                            labelPosition='right'
                            onChange={onChange}
                            size='small'
                            style={styles.input}
                            value={data.financePoints}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>
                        Product
                            <Popup
                                trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                                content='Product'
                                position='right center'
                                style={{ opacity: '0.9' }}
                            /> 
                        </label>
                        <Input
                            type="number"
                            name="productPoints"
                            id="productPoints"
                            label={{ basic: true, content: '%' }}
                            labelPosition='right'
                            onChange={onChange}
                            size='small'
                            style={styles.input}
                            value={data.productPoints}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>
                        Organisation
                            <Popup
                                trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                                content='Organisation'
                                position='right center'
                                style={{ opacity: '0.9' }}
                            /> 
                        </label>
                        <Input
                            type="number"
                            name="orgPoints"
                            id="orgPoints"
                            label={{ basic: true, content: '%' }}
                            labelPosition='right'
                            onChange={onChange}
                            size='small'
                            style={styles.input}
                            value={data.orgPoints}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>
                        Partnership
                            <Popup
                                trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                                content='Partnership'
                                position='right center'
                                style={{ opacity: '0.9' }}
                            /> 
                        </label>
                        <Input
                            type="number"
                            name="partnerPoints"
                            id="partnerPoints"
                            label={{ basic: true, content: '%' }}
                            labelPosition='right'
                            onChange={onChange}
                            size='small'
                            style={styles.input}
                            value={data.partnerPoints}
                        />
                    </Form.Field>
                </Form.Group>
            </Form.Field>
        </Form>
    </Container>
)

export default View;
