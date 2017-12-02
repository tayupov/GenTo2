import React from 'react';
import PropTypes from 'prop-types';

import { Card, Item, Label, Dimmer, Loader } from 'semantic-ui-react';

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
                {item.name.substring(0, 3).toUpperCase()}
            </Item.Content>

            <Item.Content href={`/dao/${item.address}`} >
                <Item.Header as='a'>{item.name}</Item.Header>
                <Item.Meta>
                    <span className='cinema'>{item.date}</span>
                </Item.Meta>
                <Item.Description>{item.address}</Item.Description>
                <Item.Extra>
                    <Label>My ICO</Label>
                    <Label>Active</Label>
                    <Label>0/100 tokens sold</Label>
                </Item.Extra>
            </Item.Content>
        </Item>
    ))
}

DAOList.propTypes = {
    items: PropTypes.array.isRequired
}

export default DAOList;