import web3 from 'utils/web3';

import AuctionTokenContract from 'assets/contracts/AuctionToken.json'
import GenToFactoryContract from 'assets/contracts/GenToFactory.json'

export const createGentoFactoryInstance = (callback) => {
      const GenToFactory = web3.eth.contract(GenToFactoryContract.abi);
      getNetworkId(netId => {
        const instance = GenToFactory.at(GenToFactoryContract.networks[netId.toString()].address);
        callback(instance);
      })
}

export const createAuctionTokenInstance = (address) => {
    const AuctionToken = web3.eth.contract(AuctionTokenContract.abi);
    const instance = AuctionToken.at(address);
    return instance;
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