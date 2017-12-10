import React from 'react';

import { Form, Input, TextArea, Container } from 'semantic-ui-react';

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
    width: '150px',
    margin: '0em 3em'
  }
}

const View = ({
    onChange, data, errors
}) => (
    <Container style={styles.root}>
        <Form id="name-form">
            <Form.Field error={!!errors.minPartic}>
                <label style={styles.firstLabel}>Set the participation minimum</label>
                <Input
                    type="number"
                    name="minPartic"
                    id="minPartic"
                    label={{ basic: true, content: '%' }}
                    labelPosition='right'
                    onChange={onChange}
                    size='small'
                    style={styles.input}
                    value={data.minPartic}
                />
            </Form.Field>
            {errors.minPartic && <InlineError text={errors.minPartic} />}
            <Form.Field error={!!errors.decidingPercentage}>
                <label style={styles.label}>Set the deciding percentage</label>
                <Input
                    type="number"
                    name="decidingPercentage"
                    id="decidingPercentage"
                    label={{ basic: true, content: '%' }}
                    labelPosition='right'
                    onChange={onChange}
                    size='small'
                    style={styles.input}
                    value={data.decidingPercentage}
                />
            </Form.Field>
            <Form.Field>
                <label style={styles.label}>Choose the voting range</label>
                <Input
                    type="number"
                    name="minVoting"
                    label="FROM"
                    labelPosition="left"
                    id="saleStart"
                    value={data.minVoting}
                    onChange={onChange}
                    size="small"
                    style={styles.input}
                />
                {errors.minVoting && <InlineError text={errors.minVoting} />}
                <Input
                    type="number"
                    name="maxVoting"
                    label="TO"
                    labelPosition="right"
                    id="saleEnd"
                    value={data.maxVoting}
                    onChange={onChange}
                    size="small"
                    style={styles.input}
                />
                {errors.maxVoting && <InlineError text={errors.maxVoting} />}
            </Form.Field>
            {errors.daoDescription && <InlineError text={errors.daoDescription} />}
        </Form>
    </Container>
)

export default View;
