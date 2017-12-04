import React from 'react'

import { Form, Input, Select, Container } from 'semantic-ui-react';

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

const options = [
  { key: 'kether', text: 'kether', value: 'kether' },
  { key: 'ether', text: 'ether', value: 'ether' },
  { key: 'finney', text: 'finney', value: 'finney' },
  { key: 'gwei', text: 'gwei', value: 'gwei' },
  { key: 'mwei', text: 'mwei', value: 'mwei' },
]


const View = ({
  onChange, data, errors, onSubmit, onChangeSelect
}) => (

    <Container style={styles.root}>
      <Form id="name-form">
        <Form.Field>
          <label style={styles.firstLabel}>Choose your Ethereum currency!</label>
          <Select
            id='selectedCurrency'
            name='selectedCurrency'
            compact
            options={options}
            defaultValue='ether'
            value={data.selectedCurrency}
            style={styles.input}
            required
            onChange={onChangeSelect}
          />
        </Form.Field>
        {errors.selectedCurrency && <InlineError text={errors.selectedCurrency} />}
        <Form.Field>
          <label style={styles.label}>Choose your MIN and MAX price!</label>
          <Input
            type="number"
            name="minPrice"
            label="MIN"
            labelPosition="left"
            id="saleStart"
            value={data.minPrice}
            onChange={onChange}
            size="small"
            style={styles.input}
          />
          {errors.minPrice && <InlineError text={errors.minPrice} />}
          <Input
            type="number"
            name="maxPrice"
            label="MAX"
            labelPosition="right"
            id="saleEnd"
            value={data.maxPrice}
            onChange={onChange}
            size="small"
            style={styles.input}
          />
          {errors.maxPrice && <InlineError text={errors.maxPrice} />}
        </Form.Field>
        {errors.maxMinConstraint && <InlineError text={errors.maxMinConstraint} />}
      </Form>
    </Container>
)

export default View
