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
    handleShow, handleHide, active, steps, open, closeOnRootNodeClick, close
}) => (
      <div>
        <Modal
          open={open}
          closeOnRootNodeClick={closeOnRootNodeClick}
          onClose={close}
        >
          <Modal.Header>
            Create an ICO
          </Modal.Header>
          <Modal.Content>
            <HeaderSection text="GENERATE YOUR OWN SMART CONTRACTS" />
            <Button onClick={handleShow} color='teal'>Create an ICO</Button>
                  <Button
                      onClick={handleHide}
                      icon='close'
                      floated='right'
                      basic
                      circular
                  />
                  <div
                      className='step-progress'
                      style={{ width: '600px', marginLeft: '3.3em' }}
                  >
                    <StepZilla
                      steps={steps}
                    />
                  </div>
        </Modal.Content>
      </Modal>
      </div>
)


export default GenerateICO;
