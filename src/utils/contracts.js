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

const validProposalKeys = [
  'name',
  'description',
  'beneficiary',
  'weiAmount',
  'fieldOfWork'
]

export const omitInvalidProposalKeys = (state) => _.pick(state, validProposalKeys)