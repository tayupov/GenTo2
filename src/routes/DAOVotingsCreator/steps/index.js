import React from 'react';

import General from './General';
import Organisational from './Organisational';

export default [
  { name: 'GENERAL', component: <General />, validator: null },
  { name: 'ORGANISATIONAL', component: <Organisational />, validator: null },
]