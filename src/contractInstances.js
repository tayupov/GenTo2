import { auctionTokenData, gentoFactoryData } from 'contracts';
import web3 from 'myWeb3';

export const createGentoFactoryInstance = () => {
    const GenToFactory = web3.eth.contract(gentoFactoryData.abi);
    const instance = GenToFactory.at('0x4951a7aa8ec006517994e1ace27c28a2bfe46beb');
    return instance;
}

export const createAuctionTokenInstance = (address) => {
    const AuctionToken = web3.eth.contract(auctionTokenData.abi);
    const instance = AuctionToken.at(address);
    return instance;
}