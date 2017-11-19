import React, { Component } from 'react';

//import { Form, Input, Select, Container, Button } from 'semantic-ui-react';

//import InlineError from 'components/InlineError';

import View from './View'



class Pricing extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        selectedCurrency: 'ether',
        minPrice: 0,
        maxPrice: 0,
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
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      console.log(this.state.data);
      this.props.updateStore(this.state.data);
      //this.props.submitTokenContract(() => {});

      //this.props.submitTokenContract().then(data => {console.log(data)}) ;
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
    console.log(JSON.stringify(this.state));
    console.log(JSON.stringify(this.props.getStore()))
    this.setState({
      data: {
        ...this.state.data,
        selectedCurrency: value
      }
    })
  }

  onChange = e => {
    console.log(JSON.stringify(this.state));
    console.log(e.target.name);
    console.log(e.target.value);
    console.log(JSON.stringify(this.props.getStore()))
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }
  // onChange = e => {
  //   this.setState({
  //      [e.target.name]: e.target.value
  //   })
  // }

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

export default Pricing;


// import React from 'react';

// const Pricing = () => (
//   <div>
//     <h1>Pricing</h1>
//     <h2>What is the tokens Minimum and Maximum price during the auction?</h2>
//     <select>
//       <option value="kether-grand">kether / grand</option>
//       <option value="ether">ether</option>
//       <option value="finney">finney</option>
//       <option value="gwei-shannon">gwei / shannon</option>
//       <option value="mwei-babbage">mwei / babbage</option>
//     </select>

//     <h2>Choose your <strong>Min</strong> and <strong>Max</strong> price</h2>

//     <form id="price-form">
//       <label>Minimum</label>
//       <br/>
//       <input type="number" name="minimum-price"/>
//       <br/>
//       <label>Maximum</label>
//       <br/>
//       <input type="number" name="maximum-price"/>
//       <br/>
//       <input type="submit" name="create-button" value="Create Contract"/>
//     </form>
//   </div>

// )

// export default Pricing;
