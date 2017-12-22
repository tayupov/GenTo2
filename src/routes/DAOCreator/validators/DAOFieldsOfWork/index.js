import { dmrReward, financePoints, productPoints, orgPoints, partnerPoints } from 'constants/validators';

export default function validateDAOFieldsOfWork() {
    const dmrRewardValue = document.getElementById(dmrReward).value;
    const financePointsValue = document.getElementById(financePoints).value;
    const productPointsValue = document.getElementById(productPoints).value;
    const orgPointsValue = document.getElementById(orgPoints).value;
    const partnerPointsValue = document.getElementById(partnerPoints).value;

    //TODO: validate
    return {
        dmrReward: dmrRewardValue,
        financePoints: financePointsValue,
        productPoints: productPointsValue,
        orgPoints: orgPointsValue,
        partnerPoints: partnerPointsValue
    }
}