const proposalFields = [
  "recipient",
  "amount",
  "name",
  "description",
  "proposalDeadline",
  "finished",
  "proposalPassed",
  "passedPercent",
  "dividend",
  "dmr"
]
module.exports=(dao) => {
  return async (proposalID) => {
    const proposalRawData = await dao.getProposal.call(proposalID)
    if (proposalRawData.length != proposalFields.length) throw "someone changed get proposal. You need to change this aswell or all tests will fail"
    const proposalFormatted = {}
    for (let i=0; i<proposalFields.length; i++) {
      proposalFormatted[proposalFields[i]] = proposalRawData[i]
    }
    return proposalFormatted
  }
}
