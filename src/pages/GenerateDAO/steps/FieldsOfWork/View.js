import React from 'react';

import { Form, Input, TextArea, Container, Popup, Icon } from 'semantic-ui-react';

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
    width: '170px'
  }
}

const View = ({
    onChange, data, errors
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
                    onChange={onChange}
                    size='small'
                    style={styles.input}
                    value={data.dmrReward}
                />
            </Form.Field>
            {errors.dmrReward && <InlineError text={errors.dmrReward} />}
            <Form.Field>
                <label style={styles.label}>
                Set the number of Voting Points for each field of work
                    <Popup
                        trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                        content='Decisionmaker (DMR) is a shareholder who votes on a proposal'
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
