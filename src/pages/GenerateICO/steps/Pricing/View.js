import React from 'react'

import { Form, Input, Select, Container, Button } from 'semantic-ui-react';

import InlineError from 'components/InlineError';



const View = ({
  onChange, data, errors, styles, options
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
            style={styles.input}
            required
            onChange={this.onChangeSelect}
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
            onChange={this.onChange}
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
            onChange={this.onChange}
            size="small"
            style={styles.input}
          />
          {errors.maxPrice && <InlineError text={errors.maxPrice} />}
        </Form.Field>
        {errors.minMaxConstraint && <InlineError text={errors.minMaxConstraint} />}
        <Button color='teal' onClick={this.onSubmit}>Create Contract</Button>
      </Form>
    </Container>
)

export default View
