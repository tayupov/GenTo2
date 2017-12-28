import React from 'react';
import { Link } from 'react-router-dom';

import StepZilla from 'react-stepzilla';

import { Input, Button, Dropdown } from 'semantic-ui-react';

import Organisational from 'routes/DAOVotingsCreator/steps/Organisational';
import Created from 'routes/DAOVotingsCreator/steps/Created';
import General from 'routes/DAOVotingsCreator/steps/General';

import ModalWrapper from 'components/ModalWrapper';

const MultiStepWithModal = ModalWrapper(StepZilla);

const options = [
    { key: 'active', text: 'active', value: 'active' },
    { key: 'completed', text: 'completed', value: 'completed' },
  ]

const steps = [
    {name: 'GENERAL',component: <General getStore={this.getStore} updateStore={this.updateStore} />},
    {name: 'ORGANISATIONAL', component: <Organisational getStore={this.getStore} updateStore={this.updateStore} submitTokenContract={this.submitTokenContract} /> },
    {name: 'POLL CREATED', component: <Created />}
]

const SearchNav = ({
    onChange
}) => (
    <div style={{ marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Input
            action={<Dropdown button basic floating options={options} onChange={onChange} defaultValue='active' />}
            icon='search'
            iconPosition='left'
            placeholder='Search...'
        />
        <MultiStepWithModal
            trigger={<Link to='generatePoll'><Button color='teal'>Create a Voting</Button></Link>}
            steps={steps}
            nextButtonCls="ui positive button"
            backButtonCls="ui positive button"
            nextTextOnFinalActionStep="Submit Poll"
        />
    </div>
)

export default SearchNav;