import React, { Component } from 'react';
import StepZilla from 'react-stepzilla';
import { Button } from 'semantic-ui-react';

import steps from './steps';
import 'styles/DAOCreator.css';

export default class DAOCreator extends React.Component {
  render() {
    return (
      <StepZilla steps={steps} />
    )
  }
}
