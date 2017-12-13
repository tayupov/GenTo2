import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'semantic-ui-react';

const Created = () => (
    <div>
        <h1>Your ICO has been successfully created!</h1>
        <Link to='/list'>
            <Button positive style={{ marginBottom: '1em' }}>
                Show me the ICO list
            </Button>
        </Link>
    </div>
)

export default Created;