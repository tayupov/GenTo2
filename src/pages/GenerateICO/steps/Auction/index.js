import React, {Component} from 'react';

import View from './View'

class Auction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        auctionType: props.getStore().auctionType
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
    return(
      <View
        {...this.state}
        onChange={this.onChange}
      />
    );
  }
}

export default Auction;
