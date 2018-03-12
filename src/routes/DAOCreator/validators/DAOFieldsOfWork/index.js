import { FINANCEPOINTS, PRODUCTPOINTS, ORGPOINTS, PARTNERPOINTS } from 'constants/validators';

export default function validateDAOFieldsOfWork() {
    const financePointsValue = document.getElementById(FINANCEPOINTS).value;
    const productPointsValue = document.getElementById(PRODUCTPOINTS).value;
    const orgPointsValue = document.getElementById(ORGPOINTS).value;
    const partnerPointsValue = document.getElementById(PARTNERPOINTS).value;

    //TODO: validate
    return {
        financePoints: financePointsValue,
        productPoints: productPointsValue,
        orgPoints: orgPointsValue,
        partnerPoints: partnerPointsValue
    }
}