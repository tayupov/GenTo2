import React from 'react';
import StepZilla from 'react-stepzilla';

import { Button } from 'semantic-ui-react';

import ModalWrapper from 'components/ModalWrapper';
import HeaderSection from 'components/Header';

import './GeneratePoll.css';

const MultiStepWithModal = ModalWrapper(StepZilla);

const GeneratePoll = ({
    handleShow, handleHide, active, steps
}) => (
    <div>
        <HeaderSection text="GENERATE YOUR VOTING" />
        <Button onClick={handleShow} color='teal'>
            Create a Voting
        </Button>
        <MultiStepWithModal
            steps={steps}
            nextButtonCls="ui positive button"
            backButtonCls="ui positive button"
            nextTextOnFinalActionStep="Submit Poll"
            active={active}
            handleHide={handleHide}
        />
    </div>
)

export default GeneratePoll;