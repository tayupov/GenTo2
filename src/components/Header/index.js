import React from 'react';
import PropTypes from 'prop-types';
import '../../index.css';

import { Divider } from 'semantic-ui-react';

const Header = ({ text }) => (
    <div style={{ textAlign: 'center', marginTop: '1em' }}>
        <h1>{text}</h1>
        <Divider />
    </div>
)

Header.propTypes = {
    text: PropTypes.string.isRequired
}

export default Header;
