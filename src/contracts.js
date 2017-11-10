import axios from 'axios';

const backend_url = 'http://localhost:3000';

export const auctionTokenData = axios.get(backend_url + '/contracts/auction')
                                        .then((response) => response.data)          

export const gentoFactoryData = axios.get(backend_url + '/contracts/factory')
                                        .then((response) => response.data)