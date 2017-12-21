import { tokenName, tickerSymbol, totalSupply, saleStart, saleEnd } from 'constants/validators';

export default function validateICOGeneral() {
    const tokenNameValue = document.getElementById(tokenName).value;
    const tickerSymbolValue = document.getElementById(tickerSymbol).value;
    const totalSupplyValue = document.getElementById(totalSupply).value;
    const saleStartValue = document.getElementById(saleStart).value;
    const saleEndValue = document.getElementById(saleEnd).value;

    //TODO: validate
}