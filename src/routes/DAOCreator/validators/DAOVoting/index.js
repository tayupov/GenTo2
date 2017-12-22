import { minPartic, decidingPercentage } from 'constants/validators';

export default function validateDAOVoting() {
    const minParticValue = document.getElementById(minPartic).value;
    const decidingPercValue = document.getElementById(decidingPercentage).value;

    //TODO: validate
    return {
        minPartic: minParticValue,
        decidingPercentage: decidingPercValue
    }
}