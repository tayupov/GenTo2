import React, {Component} from 'react';
import PropTypes from 'prop-types';

import View from './View';

class General extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        daoName: props.getStore().daoName,
        daoWebsite: props.getStore().daoWebsite,
        daoDescription: props.getStore().daoDescription,
      },
      errors: {
        daoName: '',
        daoWebsite: '',
        daoDescription: ''
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
    if (!data.daoName) errors.daoName = "Can't be blank!";
    if (!data.daoWebsite) errors.daoWebsite = "Can't be blank!";
    if (!data.daoDescription) errors.daoDescription = "Can't be blank!";    
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

General.propTypes = {
  updateStore: PropTypes.func.isRequired
}

export default General;
