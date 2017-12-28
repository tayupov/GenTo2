import React from 'react';
import StepZilla from 'react-stepzilla';

import steps from './steps';

export default class DAOCreator extends React.Component {

  render() {
    return (
      <StepZilla steps={steps} stepsNavigation={false} />
    )
  }
}
