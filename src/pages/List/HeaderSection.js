import React from 'react';
import PropTypes from 'prop-types';

import { Divider } from 'semantic-ui-react';

import Header from 'components/Header';

const HeaderSection = ({ account }) => (
    <div className="flexCenter" style={{ flexDirection: 'column', textAlign: 'center' }}>
        <Header text="LIST OF YOUR OWN TOKEN SALES (ICO)" />
        <h1 style={{ fontWeight: 100 }}>Your current address: </h1>
        <h3>{account}</h3>
    </div>
)

HeaderSection.propTypes = {
    account: PropTypes.string.isRequired
}

export default HeaderSection;