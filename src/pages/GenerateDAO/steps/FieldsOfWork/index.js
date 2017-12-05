import React, {Component} from 'react';
import PropTypes from 'prop-types';

import View from './View';

class FieldsOfWork extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        dmrReward: props.getStore().dmrReward,
        financePoints: props.getStore().financePoints,
        productPoints: props.getStore().productPoints,
        orgPoints: props.getStore().orgPoints,
        partnerPoints: props.getStore().partnerPoints,        
      },
      errors: {
        dmrReward: '',
        financePoints: '',
        productPoints: '',
        orgPoints: '',
        partnerPoints: ''
      }
    };
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
      }
    })
  }

  validate = data => {
    const errors = {};
    
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

FieldsOfWork.propTypes = {
  updateStore: PropTypes.func.isRequired
}

export default FieldsOfWork;
