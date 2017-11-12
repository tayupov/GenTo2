import React from 'react';

import Sidebar from './Sidebar';
import ICOList from './ICOList';

import { Container, Item} from 'semantic-ui-react';

const View = ({
    items, account
}) => (
    <div style={{display:'flex'}}>
        <Sidebar style={{ flex: '0 200px', width: '200px', marginRight: '20px'}}  />
        <Item.Group 
            divided 
            style={{ flex: 1}}
        >
            <ICOList items={items} />
        </Item.Group>

    </div>
)

export default View;