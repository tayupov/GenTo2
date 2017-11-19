import React, { Component } from 'react';

import View from './View';

class Amount extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        totalSupply: props.getStore().totalSupply,
        saleStart: props.getStore().saleStart,
        saleEnd: props.getStore().saleEnd
      },
      errors: {
        totalSupply: '',
        date: ''
      }
    }
  }

  componentWillUnmount() {

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
    if (data.totalSupply <= 0) errors.totalSupply = "Your total token supply must be larger than 0";
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

export default Amount;
