import React from 'react';
import StepZilla from 'react-stepzilla';

import { Button } from 'semantic-ui-react';

import withModal from 'hoc/withModal';
import HeaderSection from 'components/Header';

import './GeneratePoll.css';

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
            nextTextOnFinalActionStep="Submit Poll"
        />
    </div>
)

export default GeneratePoll;