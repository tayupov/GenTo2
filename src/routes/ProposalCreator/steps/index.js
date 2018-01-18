import React from 'react';

import ProposalsGeneral from './ProposalsGeneral';
import ProposalsOrganisational from './ProposalsOrganisational';

import ValidateProposalsGeneral from '../validators/ProposalsGeneral';
import ValidateProposalsOrganisational from '../validators/ProposalsOrganisational';

export default [
  { name: 'GENERAL', component: <ProposalsGeneral />, validator: ValidateProposalsGeneral },
  { name: 'ORGANISATIONAL', component: <ProposalsOrganisational />, validator: ValidateProposalsOrganisational },
]