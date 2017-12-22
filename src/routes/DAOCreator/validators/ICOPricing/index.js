import { selectedCurrency, startPrice, endPrice } from 'constants/validators';

export default function validateICOPricing() {
    const selectCurrValue = document.getElementById(selectedCurrency).value;
    const startPriceValue = document.getElementById(startPrice).value;
    const endPriceValue = document.getElementById(endPrice).value;

    //TODO: validate
    return {
        selectedCurrency: selectCurrValue,
        startPrice: startPriceValue,
        endPrice: endPriceValue
    }
}