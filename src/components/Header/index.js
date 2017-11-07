import React from 'react';
import { Divider } from 'semantic-ui-react';

const Header = ({ text }) => (
    <div style={{ textAlign: 'center', marginTop: '1em' }}>
        <h1>{text}</h1>
        <Divider />
    </div>
)

export default Header;