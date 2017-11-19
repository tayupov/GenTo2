import React from 'react';

import { Link } from 'react-router-dom';

import { Button } from 'semantic-ui-react';

const Created = () => (
    <div>
        <h1>Your ICO has been successfully created!</h1>
        <Link to='/'>
            <Button positive style={{ marginTop: '1em' }}>
                Back to Home Page
            </Button>
        </Link>
    </div>
)

export default Created;