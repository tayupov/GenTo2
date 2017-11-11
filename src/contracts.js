import axios from 'axios';

const backend_url = 'http://localhost:3000';

export const auctionTokenData = axios.get(backend_url + '/contracts/auction')
                                        .then((response) => response.data)

export const gentoFactoryData = axios.get(backend_url + '/contracts/factory')
                                        .then((response) => response.data)


/*
"0x6291c0cf0d591b2e111b06662394b7cb72ae9f4d", updated_at: 1509359799608}
1509366942847
:
{events: {…}, links: {…}, address: "0x75a67cbe03ef3d023666d777d37822d6c26b7220", updated_at: 1509366944342}
1509368476706
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1509368580436}
1509370290641
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1509370887066}
1509465017031
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1509465091987}
1509883575084
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1509883636275}
1510408225566
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1510408253763}
1510409329865
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1510409357426}
1510410170907
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1510410233414}
1510410432168
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1510410452291}
1510410685464
:
{events: {…}, links: {…}, address: "0x0c78242346950dbb7a78d59544adf79ab3a1d274", updated_at: 1510410710211}
*/
