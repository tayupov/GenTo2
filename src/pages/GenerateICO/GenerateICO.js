import React, {Component} from 'react';

import {
    Button,
    Dimmer,
    Segment,
    Icon,
    Header,
    Container,
    Modal
} from 'semantic-ui-react';
import StepZilla from 'react-stepzilla';

import withModal from 'hoc/withModal';

import HeaderSection from 'components/Header';

import './main.css';

const MultiStepWithModal = withModal(StepZilla);

const GenerateICO = ({
    handleShow, handleHide, active, steps, open, closeOnRootNodeClick, close
}) => (
    <div>
      <HeaderSection text="GENERATE YOUR OWN SMART CONTRACTS" />
      <Button onClick={handleShow} color='teal'>Create an ICO</Button>
        <MultiStepWithModal
          steps={steps}
          nextButtonCls="ui positive button"
          backButtonCls="ui positive button"
        />
    </div>
)


export default GenerateICO;
