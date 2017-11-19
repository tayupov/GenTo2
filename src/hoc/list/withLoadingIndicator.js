import React from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';

const withLoadingIndicator = (Component) => (props) =>
    props.isLoading
        ? <Dimmer active inverted><Loader size='large' /></Dimmer>
        : <Component {...props} />

export default withLoadingIndicator;