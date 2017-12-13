import React from 'react';

import Sidebar from './components/Sidebar';
import ICOList from './components/ICOList';

import { Item } from 'semantic-ui-react';
import { compose } from 'recompose';

import { withLoadingIndicator, withItemsNull, withItemsEmpty } from 'hoc/list';

const withConditionalRenderings = compose(
    withLoadingIndicator,
    withItemsNull,
    withItemsEmpty
)

const ICOListWithConditionals = withConditionalRenderings(ICOList);

const List = ({
    items, account, isLoading
}) => (
    <div style={{display: 'flex'}}>
        <Sidebar style={{ flex: '0 200px', width: '200px', marginRight: '20px'}}  />
        <Item.Group
            divided 
            style={{ flex: 1}}
        >
            <ICOListWithConditionals items={items} isLoading={isLoading} />
        </Item.Group>
    </div>
)

export default List;