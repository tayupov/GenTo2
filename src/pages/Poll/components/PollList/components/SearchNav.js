import React from 'react';

import {
    Input,
    Icon,
    Button,
    Header
} from 'semantic-ui-react';

const SearchNav = ({

}) => (
    <div className='flex-center' style={{ marginBottom: '1em' }}>
        <Button color='teal'>
            Create a Voting
        </Button>
        <Input icon placeholder='Search...'>
            <input />
            <Icon name='search' />
        </Input>
    </div>
)

export default SearchNav;