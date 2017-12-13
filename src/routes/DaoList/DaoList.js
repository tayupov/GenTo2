import React from 'react';

import Sidebar from './components/Sidebar';
import DAOList from './components/DAOList';

import { Item } from 'semantic-ui-react';
import { compose } from 'recompose';

import { withLoadingIndicator, withItemsNull, withItemsEmpty } from 'hoc/list';

const withConditionalRenderings = compose(
    withLoadingIndicator,
    withItemsNull,
    withItemsEmpty
)

const DAOListWithConditionals = withConditionalRenderings(DAOList);

const DaoList = ({
    items, account, isLoading
}) => (
    <div style={{display: 'flex'}}>
        <Sidebar style={{ flex: '0 200px', width: '200px', marginRight: '20px'}}  />
        <Item.Group
            divided 
            style={{ flex: 1}}
        >
            <DAOListWithConditionals items={items} isLoading={isLoading} />
        </Item.Group>
    </div>
)

export default DaoList;