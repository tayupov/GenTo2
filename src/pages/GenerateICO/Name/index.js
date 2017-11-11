import React, {Component} from 'react';

class Name extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenName: '',
      symbol: ''
    };
  }

  isValidated() {
    this.props.setNameState(this.state);
    return true;
  }

  onChange = (str) => {
    this.setState({
      []: str
    })
  }

  render() {
    return(
      <div>
        <h1>Name</h1>
        <form id="name-form">
          <label>How shall your Token be named?</label>
          <br/>
          <input type="text" name="tokenName" onChange={this.onChange}/>
          <br/>
          <label>What would be your ticker symbol?</label>
          <br/>
          <input type="text" name="tickerName" onChange={this.onChange}/>
        </form>
      </div>
    );
  }

}

export default Name;
