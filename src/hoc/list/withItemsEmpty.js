import React from 'react';

const withItemsEmpty = (Component) => (props) =>
    !props.items.length
        ? <h1>No ICOs found!</h1>
        : <Component {...props} />

export default withItemsEmpty;