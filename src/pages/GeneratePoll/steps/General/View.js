import React from 'react';

import { Form, Input, Container, TextArea, Select} from 'semantic-ui-react';

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
      width: '280px'
    }
  }

const options = [
  { key: 'finance', text: 'finance', value: 'finance' },
  { key: 'product', text: 'product', value: 'product' },
  { key: 'organisational', text: 'organisational', value: 'organisational' },
  { key: 'marketing', text: 'marketing', value: 'marketing' }
]
  

const View = ({
    onChange, onChangeSelect, data, errors
}) => (
    <Container style={styles.root}>
        <Form id="name-form">
          <Form.Field>
            <label style={styles.firstLabel}>Enter the voting title</label>
            <Input
              type="text"
              name="pollName"
              id="pollName"
              onChange={onChange}
              value={data.pollName}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          {errors.pollName && <InlineError text={errors.pollName} />}
          <Form.Field>
            <label style={styles.label}>Choose the field of work</label>
            <Select
              id='pollCategory'
              name='pollCategory'
              compact
              options={options}
              value={data.pollCategory}
              style={styles.input}
              required
              onChange={onChangeSelect}
            />
          </Form.Field>
          <Form.Field>
            <label style={styles.label}>Enter the voting description</label>
            <TextArea
              type="text"
              name="pollDescription"
              id="pollDescription"
              onChange={onChange}
              value={data.pollDescription}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          {errors.pollDescription && <InlineError text={errors.pollDescription} />}
        </Form>
    </Container>
)

export default View;