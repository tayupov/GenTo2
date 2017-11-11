import React, {Component} from 'react';

class Name extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenName: '',
      tickerSymbol: ''
    };
  }

  isValidated() {
    this.props.setNameState(this.state);
    return true;
  }

  onChange = e => {
    this.setState({
       [e.target.name]: e.target.value
    })
  }

  render() {
    return(
      <div style={{ marginBottom: '1em' }}>
        <h1>Name</h1>
        <form id="name-form">
          <label>How shall your Token be named?</label>
          <br/>
          <input type="text" name="tokenName" onChange={this.onChange}/>
          <br/>
          <label>What would be your ticker symbol?</label>
          <br/>
          <input type="text" name="tickerSymbol" onChange={this.onChange}/>
        </form>
      </div>
    );
  }

}

export default Name;
