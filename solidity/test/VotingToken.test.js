const VotingToken = artifacts.require("./AuctionToken.sol");

const should = require('should');
const expect = require('expect');


async function getTestToken() {
  const testContract = await AuctionToken.deployed()
  //set time back to 0
  await testContract.setCurrentTime.sendTransaction(0)
  return testContract
}

contract('VotingToken', function(accounts) {
    it("schould execute votings with 2/3 confirmed votes", async function() {
        const testContract = await VotingToken.deployed()
        try {
            //set time back to 0
            await testContract.setCurrentTime.sendTransaction(1200000)
            // create 2 votings with id 0 and 1
            await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
            await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
            await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
            // console.log(boughtAmount)
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            await testContract.vote.sendTransaction(0, true, {from: accounts[1]})
            await testContract.vote.sendTransaction(0, true, {from: accounts[2]})
            await testContract.vote.sendTransaction(0, false, {from: accounts[3]})
            await testContract.setCurrentTime.sendTransaction(1300000)
            await testContract.executeVoting.sendTransaction(0)
            const p = await testContract.getVoting.call(0);
            console.log(p)
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
            await testContract.setCurrentTime.sendTransaction(1200000)
            // create 2 votings with id 0 and 1
            await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
            await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
            await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
            // console.log(boughtAmount)
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            await testContract.vote.sendTransaction(0, true, {from: accounts[1]})
            await testContract.vote.sendTransaction(0, false, {from: accounts[2]})
            await testContract.vote.sendTransaction(0, false, {from: accounts[3]})
            await testContract.setCurrentTime.sendTransaction(1300000)
            await testContract.executeVoting.sendTransaction(0)
            const p = await testContract.getVoting.call(0);
            console.log(p)
            expect(p[4]).toBe(true)
            expect(p[5]).toBe(false)
        } catch (e) {
            expect(e.message).toContain("VM Exception while processing transaction: ")
        }
    })
    it("should display correct number of votings", async function() {
        const testContract = await VotingToken.deployed()
        try {
            //set time back to 0
            await testContract.setCurrentTime.sendTransaction(1300000)
            // create 2 votings with id 0 and 1
            const numberOfInitialVotings = (await testContract.getNumVotings.call()).toNumber()
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            expect(+await testContract.getNumVotings.call()).toBe(1 + numberOfInitialVotings)
            await testContract.newVoting.sendTransaction(accounts[1], 200, {from: accounts[1]})
            expect(+await testContract.getNumVotings.call()).toBe(2+ numberOfInitialVotings)
            await testContract.newVoting.sendTransaction(accounts[1], 300, {from: accounts[1]})
            expect(+await testContract.getNumVotings.call()).toBe(3+ numberOfInitialVotings)
        } catch (e) {
            expect(e.message).toContain("VM Exception while processing transaction: ")
        }
    })

    it("should pass the voting when the person purchased a share of the company", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1400000)
        const boughtAmount1 = await testContract.buy.call({from: accounts[0], value: 10})
        /*const boughtAmount2 = await testContract.buy.call({from: accounts[1], value: 10})*/
        await delegate(accounts[1], {from: accounts[0]})
        expect(+await getInfluenceOfVoter({from: accounts[0]}, Finance).toBe(0))
        expect(+await getInfluenceOfVoter({from: accounts[1]}, Finance).toBe(10))

      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction: owner has a share")
      }
    })

    it("should fail the voting if the token holder doesn't purchased a share ", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1500000)
        expect(+await getInfluenceOfVoter({from: accounts[0]}, Finance).toBe(0))
        should.fail("this transaction should have raised an error")

      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction: owner doesn't have a share")
      }
    })

    it("should create a new voting", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.newVoting().sendTransaction({from: accounts[0]}, 100, {to: accounts[1]})
        expect(+await getNumVotings.call().toBe(numberOfInitialVotings + 1))
      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction: new voting isn't created")
      }
    })

    it("should allow voting only for shareholder", async function() {
      const testContract= await VotingToken.deployed()
      try {
        shareholder = accounts[0]
        await testContract.newVoting.sendTransaction(accounts[1], 100, {from: shareholder})
        // number of numberOfInitialVotings doesn't chance because he isn't a shareholder
        expect(+await getNumVotings.call().toBe(numberOfInitialVotings))
      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction: shareholder can't vote")

      }
    })
});
