import { auctionTokenData, gentoFactoryData } from 'contracts';
import web3 from 'myWeb3';

export const createGentoFactoryInstance = () => {
    return gentoFactoryData.then((data) => {
        const GenToFactory = web3.eth.contract(data.abi);
        const instance = GenToFactory.at('0x4951a7aa8ec006517994e1ace27c28a2bfe46beb');
        return instance;
    })
}

export const createAuctionTokenInstance = (address) => {
    return auctionTokenData.then((data) => {
        const AuctionToken = web3.eth.contract(data.abi);
        const instance = AuctionToken.at(address);
        return instance;
    })  
}