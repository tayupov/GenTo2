import { PROPOSALPAYOUT, PROPOSALTYPE } from 'constants/validators';

function getPositionInParent(elem) {
  var sibs = [];
  while (elem = elem.previousSibling) {
    sibs.push(elem);
  }
  return sibs.length+1; // Add 1 for item itself
}
export default function ValidateProposalsOrganisational() {
  const payoutValue = document.getElementById(PROPOSALPAYOUT).value;
  const proposalTypeContainer = document.getElementById(PROPOSALTYPE).getElementsByClassName("selected")[0];
  const proposalType = getPositionInParent(proposalTypeContainer);

  return {
    weiAmount: parseInt(payoutValue),
    proposalType: proposalType
  }
}