import React, {Component} from 'react';

import { Form, Container, Checkbox } from 'semantic-ui-react';

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
  input: {
    margin: '1em 1em'
  }
}

class Name extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        auctionType: ''
      },
      errors: { 
        auctionType: ''
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

  onChange = (e, { value }) => {
    this.setState({
      data: { ...this.state.data, auctionType: value }
   })
  }

  validate = data => {
    const errors = {};
    if (!data.auctionType) errors.auctionType = 'The auction type has not been selected!';
    return errors;
  }

  render() {

    const { errors } = this.state;
    
    return(
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
    );
  }

}

export default Name;
