import React from 'react';

import Sidebar from './components/Sidebar';
import ICOList from './components/ICOList';

import { Container, Item} from 'semantic-ui-react';

const List = ({
    items, account
}) => (
    <div style={{display: 'flex'}}>
        <Sidebar style={{ flex: '0 200px', width: '200px', marginRight: '20px'}}  />
        <Item.Group 
            divided 
            style={{ flex: 1}}
        >
            <ICOList items={items} />
        </Item.Group>

    </div>
)

export default List;