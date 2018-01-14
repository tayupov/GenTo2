import _ from 'lodash'

const validContractKeys = [
  'totalSupply',
  'symbol',
  'name',
  'startPrice',
  'endPrice',
  'saleStart',
  'saleEnd',
]

export const omitInvalidContractKeys = (state) => _.pick(state, validContractKeys)