import { SYMBOL, TOTALSUPPLY, SALESTART, SALEEND } from 'constants/validators';

export default function validateICOGeneral() {
    const symbolValue = document.getElementById(SYMBOL).value;
    const totalSupplyValue = document.getElementById(TOTALSUPPLY).value;
    const saleStartValue = document.getElementById(SALESTART).value;
    const saleEndValue = document.getElementById(SALEEND).value;

    //TODO: validate
    return {        
        symbol: symbolValue,
        totalSupply: totalSupplyValue,
        saleStart: new Date(saleStartValue).getTime() / 1000 ,
        saleEnd: new Date(saleEndValue).getTime() / 1000
    }
}