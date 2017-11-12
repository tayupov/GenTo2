import React, {Component} from 'react';

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
    width: '300px'
  }
}

class Name extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        tokenName: '',
        tickerSymbol: '',
      },
      errors: { 
        tokenName: '',
        tickerSymbol: ''
      },
      loading: false
    };
  }

  isValidated() {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.updateStore(this.state.data);
      return true;
    }
    return false;
  }

  onChange = e => {
    this.setState({
       data: { ...this.state.data, [e.target.name]: e.target.value }
    })
  }

  validate = data => {
    const errors = {};
    if (!data.tokenName) errors.tokenName = "Can't be blank";
    console.log(data.tickerSymbol.length);
    if (data.tickerSymbol.length !== 3) errors.tickerSymbol = "The number of letters must equal 3";
    return errors;
  }

  render() {

    const { errors } = this.state;
    
    return(
      <Container style={styles.root}>
        <Form id="name-form" action=''>
          <Form.Field error={!!errors.tokenName}>
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
          {errors.tokenName && <InlineError text={errors.tokenName} />}
          <Form.Field error={!!errors.tickerSymbol}>
            <label style={styles.label}>What would be your ticker symbol?</label>
            <input
              type="text"
              name="tickerSymbol"
              id="tickerSymbol"
              onChange={this.onChange}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          {errors.tickerSymbol && <InlineError text={errors.tickerSymbol} />}
        </Form>
      </Container>
    );
  }

}

export default Name;
