import React from 'react';

import { Form, Input, Container } from 'semantic-ui-react';

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
      width: '200px'
    }
  }

const View = ({
    onChange, data, errors
}) => (
    <Container style={styles.root}>
        <Form id="name-form">
          <Form.Field>
            <label style={styles.firstLabel}>What is the title of the poll?</label>
            <Input
              type="text"
              name="pollName"
              id="pollName"
              onChange={onChange}
              defaultValue={data.pollName}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          {errors.pollName && <InlineError text={errors.pollName} />}
          <Form.Field>
            <label style={styles.firstLabel}>What is the Description of the poll?</label>
            <Input
              type="text"
              name="pollDescription"
              id="pollDescription"
              onChange={onChange}
              defaultValue={data.pollDescription}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          {errors.pollDescription && <InlineError text={errors.pollDescription} />}
        </Form>
    </Container>
)

export default View;