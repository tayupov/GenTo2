import React from 'react';
import StepZilla from 'react-stepzilla';
import { Container } from 'semantic-ui-react';

import steps from './steps';

export default class DAOCreator extends React.Component {

  render() {
    return (
      <Container>
        <StepZilla steps={steps} stepsNavigation={false} />
      </Container>
    )
  }
}
