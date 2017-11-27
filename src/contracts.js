import AuctionToken from 'assets/contracts/AuctionToken.json';
import GenToFactory from 'assets/contracts/GenToFactory.json'

export const auctionTokenData = AuctionToken;
export const gentoFactoryData = GenToFactory;

// export const auctionTokenData = fetch(process.env.REACT_APP_BACKEND_URL + '/contracts/auction')
//                                         .then((response) => response.json())

// export const gentoFactoryData = fetch(process.env.REACT_APP_BACKEND_URL + '/contracts/factory')
//                                         .then((response) => response.json())
