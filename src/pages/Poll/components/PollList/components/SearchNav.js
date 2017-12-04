import React from 'react';

import { Input, Icon, Button } from 'semantic-ui-react';

const SearchNav = ({
    
}) => (
    <div className='flex-center' style={{ marginBottom: '1em' }}>
        <Input icon placeholder='Search...'>
            <input />
            <Icon name='search' />
        </Input>
        <Button color='teal'>
            Create a Voting
        </Button>
    </div>
)

export default SearchNav;