import React, {Component} from 'react';

import { Form, Input, Container } from 'semantic-ui-react';

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
    width: '300px'
  }
}

class Name extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenName: '',
      tickerSymbol: ''
    };
  }

  isValidated() {
    this.props.updateStore(this.state);
    return true;
  }

  onChange = e => {
    this.setState({
       [e.target.name]: e.target.value
    })
  }

  render() {
    return(
      <Container style={styles.root}>
        <Form id="name-form">
          <Form.Field>
            <label style={styles.firstLabel}>How shall your Token be named?</label>
            <Input
              type="text"
              name="tokenName"
              id="tokenName"
              onChange={this.onChange}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          <Form.Field>
            <label style={styles.label}>What would be your ticker symbol?</label>
            <Input
              type="text"
              name="tickerSymbol"
              id="tickerSymbol"
              onChange={this.onChange}
              size='small'
              style={styles.input}
            />
          </Form.Field>
        </Form>
      </Container>
    );
  }

}

export default Name;
