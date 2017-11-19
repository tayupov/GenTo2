import React, {Component} from 'react';
import PropTypes from 'prop-types';

import View from './View';

class Name extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        tokenName: props.getStore().tokenName,
        tickerSymbol: props.getStore().tickerSymbol,
      },
      errors: {
        tokenName: '',
        tickerSymbol: ''
      }
    };
  }

  componentDidUnmount() {

  }

  isValidated() {
    const { data } = this.state;
    const { updateStore } = this.props;

    const errors = this.validate(data);

    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      updateStore(data);
      return true;
    }
    return false;
  }

  onChange = e => {
    this.setState({
       data: {
         ...this.state.data,
         [e.target.name]: e.target.value,
         tickerSymbol: e.target.value.slice(0, 3).toUpperCase()
      }
    })
  }

  validate = data => {
    const errors = {};
    if (!data.tokenName) errors.tokenName = "Can't be blank!";
    // if (data.tickerSymbol.length !== 3) errors.tickerSymbol = "The number of letters must equal 3";
    return errors;
  }

  render() {

    return(
      <View
        {...this.state}
        onChange={this.onChange}
      />
    );
  }

}

Name.propTypes = {
  updateStore: PropTypes.func.isRequired
}

export default Name;
