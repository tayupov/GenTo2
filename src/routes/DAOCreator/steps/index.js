import React from 'react';

// import DAOFieldsOfWork from './DAOFieldsOfWork';
import DAOGeneral from './DAOGeneral';
// import DAOVoting from './DAOVoting';
import ICOGeneral from './ICOGeneral';
import ICOPricing from './ICOPricing';

// import DAOFieldsOfWorkValidator from '../validators/DAOFieldsOfWork';
import DAOGeneralValidator from '../validators/DAOGeneral';
// import DAOVotingValidator from '../validators/DAOVoting';
import ICOGeneralValidator from '../validators/ICOGeneral';
import ICOPricingValidator from '../validators/ICOPricing';

export default [
  { name: 'DAO GENERAL', component: <DAOGeneral />, validator: DAOGeneralValidator },
//  { name: 'DAO FIELDS OF WORK', component: <DAOFieldsOfWork />, validator: DAOFieldsOfWorkValidator },
//  { name: 'DAO VOTING', component: <DAOVoting />, validator: DAOVotingValidator },
  { name: 'ICO GENERAL', component: <ICOGeneral />, validator: ICOGeneralValidator},
  { name: 'ICO PRICING', component: <ICOPricing />, validator: ICOPricingValidator}
]