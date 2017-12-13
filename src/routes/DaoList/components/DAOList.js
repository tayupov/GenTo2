import React from 'react';
import PropTypes from 'prop-types';

import { Item, Label } from 'semantic-ui-react';

const styles = {
    titleBox: {
        flex:'15px 0',
        fontSize: '70px',
        marginRight: '20px',
        padding: "42px 16px 32px",
        background:"teal",
        textAlign: "center",
        color: "white",
        minWidth:"186px"
    }
}

const DAOList = ({ items, isLoading }) => {

    return items.map(item => (
        <Item>
            <Item.Content style={styles.titleBox} href={`/dao/${item.address}`} >
                {item.shortName}
            </Item.Content>

            <Item.Content href={`/dao/${item.address}`} >
                <Item.Header as='a'>{item.name}</Item.Header>
                <Item.Meta>
                    <span className='cinema'>{item.date}</span>
                </Item.Meta>
                <Item.Description>{item.address}</Item.Description>
                <Item.Extra>
                    <Label>12/3000 tokens owned</Label>
                    <Label>3 open polls</Label>
                    <Label>77 voting power</Label>
                </Item.Extra>
            </Item.Content>
        </Item>
    ))
}

DAOList.propTypes = {
    items: PropTypes.array.isRequired
}

export default DAOList;