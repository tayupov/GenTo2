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
          <Form.Field error={!!errors.tokenName}>
            <label style={styles.firstLabel}>How shall your Token be named?</label>
            <Input
                type="text"
                name="tokenName"
                id="tokenName"
                onChange={onChange}
                size='small'
                style={styles.input}
                value={data.tokenName}
            />
          </Form.Field>
          {data.tokenName &&
          <Form.Field error={!!errors.tickerSymbol}>
            <label style={styles.label}>What will be your ticker symbol?</label>
            <input
                type="text"
                name="tickerSymbol"
                id="tickerSymbol"
                value={data.tokenName.slice(0, 3).toUpperCase()}
                onChange={onChange}
                size='small'
                style={styles.input}
            />
          </Form.Field>}
          {data.tokenName &&
          <Form.Field>
            <label style={styles.label}>How many tokens do you want to emmit?</label>
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
          </Form.Field>}

          {data.totalSupply &&
          <Form.Field>
            <label style={styles.label}>Time your ICO!</label>
            <Input
              type="date"
              name="saleStart"
              id="saleStart"
              value={data.saleStart}
              onChange={onChange}
              size='small'
              style={styles.input}
            />
            <Input
              type="date"
              name="saleEnd"
              id="saleEnd"
              value={data.saleEnd}
              onChange={onChange}
              size='small'
              style={styles.input}
            />
          </Form.Field>}
        </Form>
    </Container>
)

export default View;