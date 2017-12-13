import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'semantic-ui-react';

const Created = () => (
    <div>
        <h1>You have successfully submitted your Voting!</h1>
        <Link to='/poll'>
            <Button positive style={{ marginBottom: '1em' }}>
                Back to Voting Page
            </Button>
        </Link>
    </div>
)

export default Created;