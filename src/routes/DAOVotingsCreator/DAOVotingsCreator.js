import React from 'react';
import StepZilla from 'react-stepzilla';

import steps from './steps';

export default class DAOVotingsCreator extends React.Component {
    render() {
        return (
            <StepZilla steps={steps} />
        )
    }
}