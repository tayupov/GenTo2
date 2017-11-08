import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Select, Input } from 'semantic-ui-react';

const options = [
    { key: 'kether', text: 'kether', value: 'kether' },
    { key: 'ether', text: 'ether', value: 'ether' },
    { key: 'finney', text: 'finney', value: 'finney' },
    { key: 'gwei', text: 'gwei', value: 'gwei' },    
    { key: 'mwei', text: 'mwei', value: 'mwei' }, 
]

class TokenBuyForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: 0,
            etherUnit: ''
        }
    }

    onChange = e =>
        this.setState({
            [e.target.name]: e.target.value
        });

    onChangeSelect = (e, data) => {
        this.setState({
            etherUnit: data.value
        });
    }

    onSubmit = () => {
        this.props.buyToken(
            this.state.amount,
            this.state.etherUnit
        );
    }

    render() {
        const { amount, etherUnit } = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                <Input action>
                    <label htmlFor="amount" style={{ textAlign: 'right', fontWeight: '700' }}>
                        Investment amount:
                    </label>
                    <input
                        style={{ maxWidth: '120px', marginLeft: '0.5em' }}
                        id='amount'
                        name='amount'
                        type="number"
                        min='0'
                        value={amount}
                        onChange={this.onChange}
                    />
                    <Select
                        id='etherUnit'
                        name='etherUnit'
                        compact
                        options={options}
                        defaultValue='ether'
                        style={{ minWidth: '100px' }}
                        required
                        onChange={this.onChangeSelect}
                    />
                    <Button type='submit' color='teal'>
                        Buy
                    </Button>
                </Input>
            </Form>
        )
    }
}

TokenBuyForm.propTypes = {
    buyToken: PropTypes.func.isRequired
};

export default TokenBuyForm;