export const auctionTokenData = fetch(process.env.REACT_APP_BACKEND_URL + '/contracts/auction')
                                        .then((response) => response.json())

export const gentoFactoryData = fetch(process.env.REACT_APP_BACKEND_URL + '/contracts/factory')
                                        .then((response) => response.json())

 