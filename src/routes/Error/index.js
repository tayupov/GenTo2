import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => (
    <div>
        <h1>404 Page Not Found</h1>
        <Link to='/'>Return to the GenTo Home Page!</Link>
    </div>
)

export default Error;