import { VOTINGPAYOUT, VOTINGEND } from 'constants/validators';

export default function validateVotingOrganisational() {
  const payoutValue = document.getElementById(VOTINGPAYOUT).value;
  const endValue = document.getElementById(VOTINGEND).value;

  //TODO: validate
  return {
    payout: payoutValue,
    end: endValue
  }
}