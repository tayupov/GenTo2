import React, {Component} from 'react';

import { Form, Container, Checkbox } from 'semantic-ui-react';

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
  }
}

class Name extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        english: false,
        dutch: false,
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

  onChange = (e, data) => {
    this.setState({
      data: { ...this.state.data, [data.name]: data.checked }
   })
  }

  validate = data => {
    const errors = {};
    console.log(data);
    if (!(data.english || data.dutch)) errors.auctionType = 'The auction type has not been selected!';
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
              name="english"
              id="english"
              label="english"
              onChange={this.onChange}
              size='small'
              style={styles.input}
            />
            <Checkbox
              name="dutch"
              id="dutch"
              label="dutch"
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
