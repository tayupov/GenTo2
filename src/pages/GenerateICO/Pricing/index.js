import React, { Component } from 'react';

import { Form, Input, Select, Container, Button } from 'semantic-ui-react';

const styles = {
  root: {
    marginBottom: '1em'
  },
  firstLabel: {
    fontSize: '18px',
    marginTop: '3em',
    marginBottom: '0.8em',
    fontWeight: '300'
  },
  label: {
    fontSize: '18px',
    marginBottom: '1em',
    fontWeight: '300'
  },
  input: {
    width: '150px',
    margin: '0em 3em'
  }
}

const options = [
  { key: 'kether', text: 'kether', value: 'kether' },
  { key: 'ether', text: 'ether', value: 'ether' },
  { key: 'finney', text: 'finney', value: 'finney' },
  { key: 'gwei', text: 'gwei', value: 'gwei' },    
  { key: 'mwei', text: 'mwei', value: 'mwei' }, 
]
class Amount extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  // isValidated() {
  //   this.props.updateStore(this.state);
  //   return true;
  // }

  onSubmit = () => {
    const { updateStore, submitTokenContract } = this.props;

    updateStore(this.state);
    submitTokenContract();
  }

  onChangeSelect = (e, { value }) => {
    this.setState({
        selectedCurrency: value
    });
  }

  onChange = e => {
    this.setState({
       [e.target.name]: e.target.value
    })
  }

  render() {
    return(
      <Container style={styles.root}>
        <Form id="name-form">
          <Form.Field>
            <label style={styles.firstLabel}>Choose your Ethereum currency!</label>
            <Select
              id='selectedCurrency'
              name='selectedCurrency'
              compact
              options={options}
              defaultValue='ether'
              style={styles.input}
              required
              onChange={this.onChangeSelect}
            />
          </Form.Field>
          <Form.Field>
            <label style={styles.label}>Choose your MIN and MAX price!</label>
            <Input
              type="number"
              name="minPrice"
              label="MIN"
              labelPosition="left"
              id="saleStart"
              onChange={this.onChange}
              size="small"
              style={styles.input}
            />
            <Input
              type="number"
              name="maxPrice"
              label="MAX"
              labelPosition="right"
              id="saleEnd"
              onChange={this.onChange}
              size="small"
              style={styles.input}
            />
          </Form.Field>
          <Button color='teal' onClick={this.onSubmit}>Create Contract</Button>
        </Form>
      </Container>
    );
  }

}

export default Amount;


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
