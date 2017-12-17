const VotingToken = artifacts.require("./VotingToken.sol");

const should = require('should');
const expect = require('expect');

contract('VotingToken', function(accounts) {
    it("should do nothing", function() {
    })
    it("should be possible to vote", async function() {
        const testContract = await VotingToken.deployed()
        try {
            //set time back to 0
            await testContract.setCurrentTime.sendTransaction(1200000)
            await testContract.vote.sendTransaction({from: accounts[1], value: smallerBuyPrice})
            should.fail("this transaction should have raised an error")
        } catch (e) {
            expect(e.message).toContain("VM Exception while processing transaction: ")
        }
    })

});
