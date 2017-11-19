import React from 'react';

const withItemsNull = (Component) => (props) =>
    !props.items ? null : <Component { ...props } />

export default withItemsNull;