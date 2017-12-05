import React, {Component} from 'react';
import StepZilla from 'react-stepzilla';

import { Button } from 'semantic-ui-react';

import withModal from 'hoc/withModal';
import HeaderSection from 'components/Header';

import './GenerateDAO.css';

const MultiStepWithModal = withModal(StepZilla);

const GenerateDAO = ({
    handleShow, handleHide, active, steps, open, closeOnRootNodeClick, close
}) => (
    <div>
        <HeaderSection text="GENERATE YOUR OWN SMART CONTRACTS" />
        <Button onClick={handleShow} color='teal'>Create an ICO</Button>
        <MultiStepWithModal
            steps={steps}
            nextButtonCls="ui positive button"
            backButtonCls="ui positive button"
            nextTextOnFinalActionStep="Create ICO"
            active={active}
            handleHide={handleHide}
        />
    </div>
)


export default GenerateDAO;
