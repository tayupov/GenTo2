import React from 'react';
import { Button, Select, Input } from 'semantic-ui-react';

const options = [
    { key: 'kether', text: 'kether', value: 'kether' },
    { key: 'ether', text: 'ether', value: 'ether' },
    { key: 'finney', text: 'finney', value: 'finney' },
    { key: 'gwei', text: 'gwei', value: 'gwei' },    
    { key: 'mwei', text: 'mwei', value: 'mwei' }, 
]

const TokenBuyForm = () => (
    <Input type="number" placeholder='0' action>
        <input />
        <Select compact options={options} defaultValue='ether' />
        <Button type='submit'>Buy</Button>
    </Input>
)

export default TokenBuyForm;