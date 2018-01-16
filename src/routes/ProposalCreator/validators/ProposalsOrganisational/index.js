import { PROPOSALPAYOUT, PROPOSALEND } from 'constants/validators';

export default function ValidateProposalsOrganisational() {
  const payoutValue = document.getElementById(PROPOSALPAYOUT).value;
  const endValue = document.getElementById(PROPOSALEND).value;

  //TODO: validate
  return {
    payout: payoutValue,
    end: endValue
  }
}