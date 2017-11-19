import React from 'react';

import { 
    Button,
    Dimmer,
    Segment,
    Icon,
    Header,
    Container 
} from 'semantic-ui-react';

import StepZilla from 'react-stepzilla';

import withModal from 'hoc/withModal';

import HeaderSection from 'components/Header';

import './main.css';

const MultiStepWithModal = withModal(StepZilla);

const GeneratePoll = ({
    handleShow, handleHide, active, steps
}) => (
    <div>
        <HeaderSection text="GENERATE YOUR POLL" />
        <Button onClick={handleShow} color='teal'>
            Create a Poll
        </Button>
        <MultiStepWithModal
            steps={steps}
            nextButtonCls="ui positive button"
            backButtonCls="ui positive button"
            
        />
    </div>
)

export default GeneratePoll;