import { TOKENNAME, TICKERSYMBOL, TOTALSUPPLY, SALESTART, SALEEND } from 'constants/validators';

export default function validateICOGeneral() {
    const tokenNameValue = document.getElementById(TOKENNAME).value;
    const tickerSymbolValue = document.getElementById(TICKERSYMBOL).value;
    const totalSupplyValue = document.getElementById(TOTALSUPPLY).value;
    const saleStartValue = document.getElementById(SALESTART).value;
    const saleEndValue = document.getElementById(SALEEND).value;

    //TODO: validate
    return {
        tokenName: tokenNameValue,
        tickerSymbol: tickerSymbolValue,
        totalSupply: totalSupplyValue,
        saleStart: saleStartValue,
        saleEnd: saleEndValue
    }
}