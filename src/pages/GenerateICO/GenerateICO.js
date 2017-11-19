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
    handleShow, handleHide, active, steps
}) => (

      <div>
          <HeaderSection text="GENERATE YOUR OWN SMART CONTRACTS" />
          <Button onClick={handleShow} color='teal'>Create an ICO</Button>
          <Dimmer
              page
              active={active}
          >
              <Container
                  style={{ width: '700px', position: 'relative' }}
              >
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

                  </div>
              </Container>
          </Dimmer>
      </div>
)


export default GenerateICO;
