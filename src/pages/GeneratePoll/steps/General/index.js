import React, { Component } from 'react';

import View from './View';

class General extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        pollName: '',
        pollDescription: ''
      },
      errors: {
        pollName: '',
        pollDescription: ''
      }
    }
  }

  isValidated() {
    const { data } = this.state;
    const { updateStore } = this.props;

    const errors = this.validate(data);

    this.setState({ errors });
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      console.log('Does it never get set?');
      updateStore(data);
      return true;
    }
    return true;
  }

  onChange = e => {
    console.log(e.target.value);
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

  validate = data => {
    console.log(data.totalSupply);
    const errors = {};
    if ( data.pollName.length < 3) errors.pollName = "Poll name must have at least 3 characters";
    if ( data.pollDescription.length < 10) errors.pollDescription = "Poll description must have at least 10 characters";
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

export default General;
