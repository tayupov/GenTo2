import React from 'react';
import PropTypes from 'prop-types';

const InlineError = ({ text }) => <div style={{ marginBottom: '1em' }}><span style={{ color: '#ae5856' }}>{text}</span></div>;

InlineError.propTypes = {
    text: PropTypes.string.isRequired
};

export default InlineError;