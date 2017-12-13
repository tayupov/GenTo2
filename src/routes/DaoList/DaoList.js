import React from 'react';
import { Item } from 'semantic-ui-react';
import Sidebar from './components/Sidebar';
import DAOList from './components/DAOList';

export default class DaoList extends React.Component {
    render() {
        const { items, account, isLoading } = this.props;
        return (
            <div style={{ display: 'flex' }}>
                <Sidebar style={{ flex: '0 200px', width: '200px', marginRight: '20px' }} />
                <Item.Group divided style={{ flex: 1 }}>
                    <DAOList items={items} isLoading={isLoading} />
                </Item.Group>
            </div>
        )
    }
}
