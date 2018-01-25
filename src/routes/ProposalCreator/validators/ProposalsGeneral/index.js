import { PROPOSALNAME, PROPOSALCATEGORY, PROPOSALDESCRIPTION, PROPOSALBENEFICIARY } from 'constants/validators';

export default function ValidateProposalsGeneral() {
  const nameValue = document.getElementById(PROPOSALNAME).value;
  const categoryValue = document.getElementById(PROPOSALCATEGORY).value; // TODO this accesses the value of div ->
  // can not work
  const descriptionValue = document.getElementById(PROPOSALDESCRIPTION).value;
  const beneficiary = document.getElementById(PROPOSALBENEFICIARY).value;

  //TODO: validate

  return {
    name: nameValue,
    fieldOfWork: 1, // TODO: Replace with value from dropdown
    beneficiary: beneficiary,
    description: descriptionValue
  }
}