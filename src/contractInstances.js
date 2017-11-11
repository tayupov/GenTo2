import { auctionTokenData, gentoFactoryData } from 'contracts';
import web3 from 'myWeb3';

export const createGentoFactoryInstance = (callback) => {
    gentoFactoryData.then((data) => {
        const GenToFactory = web3.eth.contract(data.abi);
        console.log(data);
        getNetworkId(netId => {
          const instance = GenToFactory.at(data.networks[netId.toString()].address);
          callback(instance);
        })
    })
}

export const createAuctionTokenInstance = (address) => {
    return auctionTokenData.then((data) => {
        const AuctionToken = web3.eth.contract(data.abi);
        const instance = AuctionToken.at(address);
        return instance;
    })
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
