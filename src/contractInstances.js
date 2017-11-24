import { auctionTokenData, gentoFactoryData } from 'contracts';
import web3 from 'myWeb3';

export const createGentoFactoryInstance = (callback) => {
      const GenToFactory = web3.eth.contract(gentoFactoryData.abi);
      getNetworkId(netId => {
        const instance = GenToFactory.at(gentoFactoryData.networks[netId.toString()].address);
        callback(instance);
      })
}

export const createAuctionTokenInstance = (address) => {
    const AuctionToken = web3.eth.contract(auctionTokenData.abi);
    const instance = AuctionToken.at(address);
    return instance;

    // return auctionTokenData.then((data) => {
    //     const AuctionToken = web3.eth.contract(data.abi);
    //     const instance = AuctionToken.at(address);
    //     return instance;
    // })
}

const getNetworkId = (callback) => {
  web3.version.getNetwork((err, netId) => {
    if (err) {
      console.log('The network connection could not be established!');
      console.error(err);
    }
    return callback(netId);
  })
}
