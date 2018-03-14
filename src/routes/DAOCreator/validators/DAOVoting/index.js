import { MINPARTIC, DECIDINGPERCENTAGE } from 'constants/validators';

// *************************
// FILE NOT USED IN THE PROTOTYPE
// *************************

export default function validateDAOVoting() {
    const minParticValue = document.getElementById(MINPARTIC).value;
    const decidingPercValue = document.getElementById(DECIDINGPERCENTAGE).value;

    //TODO: validate
    return {
        minPartic: minParticValue,
        decidingPercentage: decidingPercValue
    }
}