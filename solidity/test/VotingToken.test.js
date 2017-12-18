const VotingToken = artifacts.require("./AuctionToken.sol");

const should = require('should');
const expect = require('expect');

contract('AuctionToken', function(accounts) {
    it("schould execute votings with 2/3 confirmed votes", async function() {
        const testContract = await VotingToken.deployed()
        try {
            //set time back to 0
            await testContract.setCurrentTime.sendTransaction(1200000)
            // create 2 votings with id 0 and 1
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            await testContract.vote.sendTransaction(0, true, {from: accounts[0]})
            await testContract.vote.sendTransaction(0, true, {from: accounts[1]})
            await testContract.vote.sendTransaction(0, false, {from: accounts[2]})
            await testContract.setCurrentTime.sendTransaction(1300000)
            await testContract.executeVoting.sendTransaction(0, {from: accounts[2]})
            const p = await testContract.getVoting.call(0);
            expect(p[4]).toBe(true)
            expect(p[5]).toBe(true)
        } catch (e) {
            expect(e.message).toContain("VM Exception while processing transaction: ")
        }
    })
    it("schould reject votings with 1/3 confirmed votes", async function() {
        const testContract = await VotingToken.deployed()
        try {
            //set time back to 0
            await testContract.setCurrentTime.sendTransaction(1300000)
            // create 2 votings with id 0 and 1
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            await testContract.vote.sendTransaction(1, true, {from: accounts[0]})
            await testContract.vote.sendTransaction(1, false, {from: accounts[1]})
            await testContract.vote.sendTransaction(1, false, {from: accounts[2]})
            await testContract.setCurrentTime.sendTransaction(1400000)
            await testContract.executeVoting.sendTransaction(1, {from: accounts[2]})
            const p = await testContract.getVoting.call(1);
            expect(p[4]).toBe(true)
            expect(p[5]).toBe(false)
        } catch (e) {
            expect(e.message).toContain("VM Exception while processing transaction: ")
        }
    })
});
