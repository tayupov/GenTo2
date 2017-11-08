import React, { Component } from 'react';

import { Divider } from 'semantic-ui-react';

import StepZilla from 'react-stepzilla';

import Header from 'components/Header';

import Name from './Name';
import Amount from './Amount';
import Auction from './Auction';
import Pricing from './Pricing';


const steps = [
    {name: 'name', component: <Name />},
    {name: 'amount', component: <Amount /> },
    {name: 'auction', component: <Auction /> },
    {name: 'pricing', component: <Pricing /> },
]

class MultiStepForm extends Component {
    render() {
        return(
            <div className='step-progress' style={{ textAlign: 'center', marginTop: '1em' }}>
                <Header text="GENERATE YOUR OWN ICO" />
                <StepZilla  steps={steps}  />
            </div>
        )
    }
}

export default MultiStepForm;
