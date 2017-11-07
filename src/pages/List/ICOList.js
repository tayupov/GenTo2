import React from 'react';

import { Card } from 'semantic-ui-react';

const ICOList = ({ items }) => {
    console.log(items);
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

export default ICOList;