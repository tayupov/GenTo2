import { PROPOSALNAME, PROPOSALCATEGORY, PROPOSALDESCRIPTION, PROPOSALBENEFICIARY } from 'constants/validators';

function getPositionInParent(elem) {
  var sibs = [];
  while (elem = elem.previousSibling) {
    sibs.push(elem);
  }
  return sibs.length+1; // Add 1 for item itself
}

export default function ValidateProposalsGeneral() {
  const nameValue = document.getElementById(PROPOSALNAME).value;
  const categoryContainer = document.getElementById(PROPOSALCATEGORY).getElementsByClassName("selected")[0];
  const categoryId = getPositionInParent(categoryContainer);
  const descriptionValue = document.getElementById(PROPOSALDESCRIPTION).value;
  const beneficiary = document.getElementById(PROPOSALBENEFICIARY).value;

  return {
    name: nameValue,
    fieldOfWork: categoryId,
    beneficiary: beneficiary,
    description: descriptionValue
  }
}
