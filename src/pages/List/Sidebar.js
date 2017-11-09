import React from 'react';

import { Segment, Checkbox, Search } from 'semantic-ui-react';

const Sidebar = ({style: style}) => (
    <Segment  style={{ flex: '0 250px', width: '250px', margin: '1.5em 20px 0 0 '}} >
        <h2>Filter</h2>
        <Search style={{marginBottom: '20px'}}
                loading={false}
        />
        <Checkbox style={{marginBottom: '20px'}} label='Only own ICOs' defaultChecked />
        <Checkbox style={{marginBottom: '20px'}} label='ICOs I invested in'/>
        <Checkbox style={{marginBottom: '20px'}} label='only running ICOs' defaultChecked />
    </Segment>
)

export default Sidebar;