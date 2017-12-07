import React, { Component } from 'react';

import View from './View';

class IcoGeneral extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        tokenName: props.getStore().tokenName,
        tickerSymbol: props.getStore().tickerSymbol,
        totalSupply: props.getStore().totalSupply,
        saleStart: props.getStore().saleStart,
        saleEnd: props.getStore().saleEnd
      },
      errors: {
        tokenName: '',
        tickerSymbol: '',
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
      updateStore(data);
      return true;
    }
    return true;
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

export default IcoGeneral;
