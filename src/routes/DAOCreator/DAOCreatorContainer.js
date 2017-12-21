import React, { Component } from 'react';
import web3 from 'utils/web3';

import DAOCreator from './DAOCreator';

import GenToFactory from 'assets/contracts/GenToFactory.json';
import { createGentoFactoryInstance } from 'utils/contractInstances';

export default class DAOCreatorContainer  extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <DAOCreator />
        )
    }
}
