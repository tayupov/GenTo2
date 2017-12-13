import React from 'react';

import { Segment, Checkbox, Search } from 'semantic-ui-react';

const Sidebar = () => (
    <Segment  style={{ flex: '0 250px', width: '250px', margin: '1.5em 20px 0 0 '}} >
        <h2>Filter</h2>
        <Search style={{marginBottom: '20px'}}
                loading={false}
        />
        <Checkbox style={{marginBottom: '20px'}} label='Only own DAOs' defaultChecked />
        <Checkbox style={{marginBottom: '20px'}} label='DAOs I invested in'/>
        <Checkbox style={{marginBottom: '20px'}} label='DAOs with voting power' defaultChecked />
        <Checkbox style={{marginBottom: '20px'}} label='DAOs with open polls' defaultChecked />
    </Segment>
)

export default Sidebar;