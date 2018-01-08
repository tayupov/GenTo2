import { SELECTEDCURRENCY, STARTPRICE, ENDPRICE } from 'constants/validators';

export default function validateICOPricing() {
    const selectCurrValue = document.getElementById(SELECTEDCURRENCY).value;
    const startPriceValue = document.getElementById(STARTPRICE).value;
    const endPriceValue = document.getElementById(ENDPRICE).value;

    //TODO: validate
    return {
        selectedCurrency: selectCurrValue,
        startPrice: startPriceValue,
        endPrice: endPriceValue
    }
}