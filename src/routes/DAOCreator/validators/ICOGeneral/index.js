import { TOKENNAME, SYMBOL, TOTALSUPPLY, SALESTART, SALEEND } from 'constants/validators';

export default function validateICOGeneral() {
    const tokenNameValue = document.getElementById(TOKENNAME).value;
    const symbolValue = document.getElementById(SYMBOL).value;
    const totalSupplyValue = document.getElementById(TOTALSUPPLY).value;
    const saleStartValue = document.getElementById(SALESTART).value;
    const saleEndValue = document.getElementById(SALEEND).value;

    //TODO: validate
    return {
        tokenName: tokenNameValue,
        symbol: symbolValue,
        totalSupply: totalSupplyValue,
        saleStart: new Date(saleStartValue).getTime() / 1000 ,
        saleEnd: new Date(saleEndValue).getTime() / 1000
    }
}