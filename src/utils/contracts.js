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
const validDividendProposalKeys = [
  'beneficiary',
  'weiAmount'
]
const validDmrProposalKeys = [
  'beneficiary',
  'weiAmount'
]

export const omitInvalidProposalKeys = (state) => _.pick(state, validProposalKeys)
export const omitInvalidDividendProposalKeys = (state) => _.pick(state, validDividendProposalKeys)
export const omitInvalidDmrProposalKeys = (state) => _.pick(state, validDmrProposalKeys)