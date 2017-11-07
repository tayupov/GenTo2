import React from 'react';

import HeaderSection from './HeaderSection';
import ICOList from './ICOList';

const View = ({
    items, account
}) => (
    <div>
        <HeaderSection account={account} />
        <ICOList items={items} />
    </div>
)

export default View;