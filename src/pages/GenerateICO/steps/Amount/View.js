import React from 'react';

import { Form, Input, Container } from 'semantic-ui-react';

import InlineError from 'components/messages/InlineError';

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
      width: '200px'
    }
  }

const View = ({
    onChange, data, errors
}) => (
    <Container style={styles.root}>
        <Form id="name-form">
          <Form.Field>
            <label style={styles.firstLabel}>How many tokens do you want to emmit?</label>
            <Input
              type="number"
              name="totalSupply"
              id="totalSupply"
              onChange={onChange}
              min='0'
              defaultValue={data.totalSupply}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          {errors.totalSupply && <InlineError text={errors.totalSupply} />}
          <Form.Field>
            <label style={styles.label}>Time your ICO!</label>
            <Input
              type="date"
              name="saleStart"
              id="saleStart"
              onChange={onChange}
              size='small'
              style={styles.input}
            />
            <Input
              type="date"
              name="saleEnd"
              id="saleEnd"
              onChange={onChange}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          {errors.date && <InlineError text={errors.date} />}
        </Form>
    </Container>
)

export default View;