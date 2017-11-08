import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'semantic-ui-react';

const ICOList = ({ items }) => {
    return items.map(item => (
        <Card
            key={item.address}
            style={{ fontSize: '18px' }}
            color='olive'
            fluid
            raised
            href={`/ico/${item.address}`}
            header={item.name}
            meta={item.address}
            extra={item.date}
            className='flex-center'
        />
    ))
}

ICOList.propTypes = {
    items: PropTypes.array.isRequired
}

export default ICOList;