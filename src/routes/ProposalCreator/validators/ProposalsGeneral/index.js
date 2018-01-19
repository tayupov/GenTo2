import { PROPOSALNAME, PROPOSALCATEGORY, PROPOSALDESCRIPTION } from 'constants/validators';

export default function ValidateProposalsGeneral() {
  const nameValue = document.getElementById(PROPOSALNAME).value;
  const categoryValue = document.getElementById(PROPOSALCATEGORY).value;
  const descriptionValue = document.getElementById(PROPOSALDESCRIPTION).value;

  //TODO: validate
  return {
    name: nameValue,
    category: categoryValue,
    description: descriptionValue
  }
}