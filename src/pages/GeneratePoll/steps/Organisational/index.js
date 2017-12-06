import React, {Component} from 'react';

import { Form, Input,Container } from 'semantic-ui-react';

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
    margin: '1em 1em',
    width: '200px'
  }
}

class Organisational extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        pollEnd: props.getStore().pollEnd
      },
      errors: { 
        pollEnd: ''
      },
      loading: false
    };
  }

  isValidated() {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.updateStore(this.state.data);
      this.props.submitTokenContract();
      return true;
    }
    return false;
  }

  onChange = (e, { value }) => {
    this.setState({
      data: { ...this.state.data, pollEnd: value }
   })
  }

  validate = data => {
    const errors = {};
    if (!data.pollEnd) errors.pollEnd = 'A valid end date has to be provided!';
    return errors;
  }

  render() {

    const { errors } = this.state;
    
    return(
      <Container style={styles.root}>
        <Form id="name-form" action=''>
          <Form.Field>
            <label style={styles.firstLabel}>How long should the poll last?</label>
            <Input
                type="date"
                name="pollEnd"
                id="pollEnd"
                onChange={this.onChange}
                size='small'
                style={styles.input}
            />
          </Form.Field>
          {errors.date && <InlineError text={errors.date} />}
        </Form>
      </Container>
    );
  }

}

export default Organisational;
