import React, { Component } from 'react';

import { Form, Input, Container } from 'semantic-ui-react';

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
    width: '200px'
  }
}

class Amount extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tokenAmount: 0,
    }
  }

  isValidated() {
    this.props.updateStore(this.state);
    return true;
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
            <label style={styles.firstLabel}>How many tokens do you want to emmit?</label>
            <Input
              type="number"
              name="tokenAmount"
              id="tokenAmount"
              onChange={this.onChange}
              size='small'
              style={styles.input}
            />
          </Form.Field>
          <Form.Field>
            <label style={styles.label}>Time your ICO!</label>
            <Input
              type="date"
              name="startDate"
              id="startDate"
              onChange={this.onChange}
              size='small'
              style={styles.input}
            />
            <Input
              type="date"
              name="endDate"
              id="endDate"
              onChange={this.onChange}
              size='small'
              style={styles.input}
            />
          </Form.Field>
        </Form>
      </Container>
    );
  }

}

export default Amount;





// import React from 'react';

// const Amount = () => (
//   <div>
//     <h1>Amount</h1>
//     <form id="amount-form">
//       <label>How many Tokens do you want to emit?</label>
//       <br/>
//       <input type="number" name="token-amount"/>
//     </form>
//   </div>

// )

// export default Amount;
