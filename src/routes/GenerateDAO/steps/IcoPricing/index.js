import React, { Component } from 'react';

import View from './View'



class IcoPricing extends Component {

  constructor(props) {
    super(props);

    console.log(JSON.stringify(props.getStore())) ;

    this.state = {
      data: {
        selectedCurrency: props.getStore().selectedCurrency,
        minPrice: props.getStore().minPrice,
        maxPrice: props.getStore().maxPrice,
      },
      errors: {
        selectedCurrency: '',
        minPrice: '',
        maxPrice: '',
        maxMinConstraint: ''
      }
    }
  }

  isValidated() {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      console.log(this.state.data);
      this.props.updateStore(this.state.data);
      this.props.submitTokenContract();
      //this.props.submitTokenContract().then(data => {console.log(data)}) 
      return true;
    }
    return false;
  }

  validate = data => {
    const errors = {};
    if (data.selectedCurrency === '') errors.selectedCurrency = "You have to select a currency";
    else if(data.maxPrice < data.minPrice) errors.maxMinConstraint = "Your min price should be smaller than your max price";
    else if(data.maxPrice <= 0) errors.maxPrice = "Your max price should be greater than 0";
    else if(data.minPrice < 0) errors.minPrice = "Your min price should be greater than 0";
    return errors;
  }

  onChangeSelect = (e, {value}) => {
    this.setState({
      data: {
        ...this.state.data,
        selectedCurrency: value
      }
    })
  }

  onChange = e => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

  render() {
    const { errors } = this.state;
    return(

      <View
        {...this.state}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        onChangeSelect={this.onChangeSelect}
      />
    );
  }
}

export default IcoPricing;