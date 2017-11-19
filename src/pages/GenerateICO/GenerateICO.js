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

import HeaderSection from 'components/Header';

import './main.css';

const GenerateICO = ({
    handleShow, handleHide, active, steps, open, closeOnRootNodeClick, close, closeConfigShow
}) => (

  <div>
    <h1>hallo</h1>
    <Modal trigger={<Button onClick={handleShow}>Show Modal</Button>} closeIcon>
      <Header content='Create an ICO'></Header>
      <Modal.Content>
        <StepZilla
          steps={steps}
          showNavigation= {true}
        >
        </StepZilla>
      </Modal.Content>
    </Modal>
  </div>
)




export default GenerateICO;
