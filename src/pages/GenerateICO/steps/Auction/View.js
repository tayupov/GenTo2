import React from 'react';

import { Form, Container, Checkbox } from 'semantic-ui-react';

import InlineError from 'components/InlineError';

const View = ({
  onChange, data, errors, styles
}) => (

  <Container style={styles.root}>
    <Form id="name-form" action=''>
      <Form.Field error={!!errors.tokenName}>
        <label style={styles.firstLabel}>Choose the auction type!</label>
        <Checkbox
          radio
          name="english"
          label="English"
          value="english"
          checked={this.state.data.auctionType === 'english'}
          onChange={this.onChange}
          size='small'
          style={styles.input}
        />
        <Checkbox
          radio
          name="dutch"
          label="Dutch"
          value="dutch"
          checked={this.state.data.auctionType === 'dutch'}
          onChange={this.onChange}
          size='small'
          style={styles.input}
        />
      </Form.Field>
      {errors.auctionType && <InlineError text={errors.auctionType} />}
    </Form>
  </Container>
)

export default View


/*<Container style={styles.root}>
  <Form id="name-form" action=''>
    <Form.Field error={!!errors.tokenName}>
      <label style={styles.firstLabel}>Choose the auction type!</label>
      <Checkbox
        radio
        name="english"
        label="English"
        value="english"
        checked={this.state.data.auctionType === 'english'}
        onChange={this.onChange}
        size='small'
        style={styles.input}
      />
      <Checkbox
        radio
        name="dutch"
        label="Dutch"
        value="dutch"
        checked={this.state.data.auctionType === 'dutch'}
        onChange={this.onChange}
        size='small'
        style={styles.input}
      />
    </Form.Field>
    {errors.auctionType && <InlineError text={errors.auctionType} />}
  </Form>
</Container>*/
