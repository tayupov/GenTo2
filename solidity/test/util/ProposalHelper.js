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

 module.exports = (contract, accounts) => {

  async function simulateIco(accObj) {
    // Set time between ICO start and END
    await contract.setCurrentTime.sendTransaction(1200000)
    await Object.keys(accObj).forEach(async function(accKey) {
      await contract.buy.sendTransaction({from: accounts[accKey] , value: accObj[accKey]})
    });
    // Set time to after ICO
    await contract.setCurrentTime.sendTransaction(2200000)
  }

  async function getFormattedProposal(proposalID) {
    const proposalRawData = await contract.getProposal.call(proposalID)
    if (proposalRawData.length != proposalFields.length) throw new Error("The proposal doesn't have the correct format. Please check the properties")
    const proposalFormatted = {}
    for (let i=0; i<proposalFields.length; i++) {
      proposalFormatted[proposalFields[i]] = proposalRawData[i]
    }
    return proposalFormatted
  }

  async function listenForEvent(eventName) {
    // get the event listener for the specific event
    const listener = contract[eventName]();
    const log = await new Promise((resolve, reject) => listener.get(
        (error, log) => error ? reject(error) : resolve(log)));
    // check that there one new log object
    assert.equal(log.length, 1, 'should be one new event log object');
    // return only the properties which are important for testing
    return log[0].args;
  }

  async function voteBulk(proposalID, accObj) {
    await Object.keys(accObj).forEach(async function(accKey) {
      await contract.vote.sendTransaction(proposalID, accObj[accKey], {from: accounts[accKey]})
    })
    // Set time to after the Proposal period
    await contract.setCurrentTime.sendTransaction(2300000)
  }

  return {simulateIco: simulateIco, getFormattedProposal: getFormattedProposal,
          listenForEvent: listenForEvent, voteBulk: voteBulk}
}
