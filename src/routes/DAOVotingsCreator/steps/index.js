import React from 'react';

import VotingsGeneral from './VotingsGeneral';
import VotingsOrganisational from './VotingsOrganisational';

import VotingsGeneralValidator from '../validators/VotingsGeneral';
import VotingsOrganisationalValidator from '../validators/VotingsOrganisational';

export default [
  { name: 'GENERAL', component: <VotingsGeneral />, validator: VotingsGeneralValidator },
  { name: 'ORGANISATIONAL', component: <VotingsOrganisational />, VotingsOrganisationalValidator },
]