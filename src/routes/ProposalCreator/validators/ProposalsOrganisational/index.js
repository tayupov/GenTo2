import { PROPOSALPAYOUT, PROPOSALTYPE } from 'constants/validators';

function getPositionInParent(elem) {
  let sibs = [];
  while (elem) {
    sibs.push(elem);
    elem = elem.previousSibling
  }
  return sibs.length; // Add 1 for item itself
}
export default function ValidateProposalsOrganisational() {
  const payoutValue = document.getElementById(PROPOSALPAYOUT).value;
  const proposalTypeContainer = document.getElementById(PROPOSALTYPE).getElementsByClassName("selected")[0];
  const proposalType = getPositionInParent(proposalTypeContainer);

  return {
    weiAmount: parseInt(payoutValue, 10),
    proposalType: proposalType
  }
}