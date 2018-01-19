import React from 'react';
import StepZilla from 'react-stepzilla';
import { Container } from 'semantic-ui-react';

import steps from './steps';

export default class ProposalsCreator extends React.Component {
  render() {
    return (
      <Container>
        <StepZilla steps={steps} stepsNavigation={false} />
      </Container>
    );
  }
}
