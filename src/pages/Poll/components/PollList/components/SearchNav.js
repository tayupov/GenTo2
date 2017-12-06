import React from 'react';
import StepZilla from 'react-stepzilla';

import { Input, Icon, Button, Dropdown } from 'semantic-ui-react';

import Organisational from 'pages/GeneratePoll/steps/Organisational';
import Created from 'pages/GeneratePoll/steps/Created';
import General from 'pages/GeneratePoll/steps/General';

import withModal from 'hoc/withModal';

const MultiStepWithModal = withModal(StepZilla);

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
            trigger={<Button color='teal'>Create a Voting</Button>}
            steps={steps}
            nextButtonCls="ui positive button"
            backButtonCls="ui positive button"
            nextTextOnFinalActionStep="Submit Poll"
        />
    </div>
)

export default SearchNav;