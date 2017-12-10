import React, {Component} from 'react';

import { Form, Input, Container, Popup, Icon, Dropdown } from 'semantic-ui-react';

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
    margin: '1em 1em',
    width: '200px'
  }
}

const options = [
  { key: 'kether', text: 'kether', value: 'kether' },
  { key: 'ether', text: 'ether', value: 'ether' },
  { key: 'finney', text: 'finney', value: 'finney' },
  { key: 'gwei', text: 'gwei', value: 'gwei' },
  { key: 'mwei', text: 'mwei', value: 'mwei' },
]


class Organisational extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        pollEnd: props.getStore().pollEnd,
        pollPayout: props.getStore().pollEnd,
        pollCurrency: props.getStore().pollCurrency
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

  onChange = e => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

  onChangeSelect = (e, { value }) => {
    this.setState({
        pollCurrency: value
    });
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
            <label style={styles.firstLabel}>
            Set the payout amount 
                <Popup
                    trigger={<Icon name='help' color='grey' size='small' circular style={{ marginLeft: '0.5em' }} />}
                    content='Payout amount is the amount of Ether you get if your Voting is successful'
                    position='right center'
                    style={{ opacity: '0.9' }}
                /> 
            </label>
            <Input
                type="number"
                name="pollPayout"
                id="pollPayout"
                label={<Dropdown defaultValue='finney' options={options} onChange={this.onChangeSelect} />}
                labelPosition='right'
                onChange={this.onChange}
                size='small'
                style={styles.input}
                value={this.state.data.pollPayout}
            />
          </Form.Field>
          <Form.Field>
            <label style={styles.label}>How long should the voting last?</label>
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
