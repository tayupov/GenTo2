const VotingToken = artifacts.require("./AuctionToken.sol");
const AuctionToken = artifacts.require("./AuctionToken.sol");
const FieldOfWork = artifacts.require("./VotingToken.sol");


const should = require('should');
const expect = require('expect');


async function getTestToken() {
  const testContract = await AuctionToken.deployed()
  //set time back to 0
  await testContract.setCurrentTime.sendTransaction(0)
  return testContract
}

/*
method signatures:

newVoting.sendTransaction(account, value, {from})
buy.sendTransaction({from, value})
vote.sendTransaction(voteId, supportsVoting, {from})
executeVoting.sendTransaction(voteId, {from})
newVoting.sendTransaction(account, value, FoW, {from})
getVoting(votingId)
delegate(FoW, to, {from})

set() without call()!

*/

contract('VotingToken', function(accounts) {

    it("should display the right number of initial votings", async function() {
      const testContract = await VotingToken.deployed()
      try {
        expect(+await testContract.getNumVotings.call()).toEqual(0)
      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction")
      }
    })


    it("should display correct number of votings", async function() {
        const testContract = await VotingToken.deployed()
        //set time back to 0
        await testContract.setCurrentTime.sendTransaction(1300000)
        // create 2 votings with id 0 and 1
        const numberOfInitialVotings = 0;
        await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
        // per transaction it creates two votings not one! => add 2 not 1
        expect(+await testContract.getNumVotings.call()).toBe(2 + numberOfInitialVotings)
        await testContract.newVoting.sendTransaction(accounts[1], 200, 2, {from: accounts[1]})
        expect(+await testContract.getNumVotings.call()).toBe(4 + numberOfInitialVotings)
        await testContract.newVoting.sendTransaction(accounts[1], 300, 2, {from: accounts[1]})
        expect(+await testContract.getNumVotings.call()).toBe(6)
    })


    /*it("should execute votings with 2/3 confirmed votes", async function() {
        const testContract = await VotingToken.deployed()
        //set time back to 0
        await testContract.setCurrentTime.sendTransaction(1200000)
        try {
          await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
          await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
          await testContract.buy.sendTransaction({from: accounts[3], value: 1000})
          // create new Voting with id = 0
          console.log(+await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]}))
          await testContract.vote.sendTransaction(0, true, {from: accounts[1]})
          await testContract.vote.sendTransaction(0, true, {from: accounts[2]})
          await testContract.vote.sendTransaction(0, false, {from: accounts[3]})
          await testContract.setCurrentTime.sendTransaction(1300000)
          await testContract.executeVoting.sendTransaction(0)
          const p = await testContract.getVoting.call(0);
          console.log(p)
          expect(p[4]).toBe(true)
          expect(p[5]).toBe(true)
        } catch(e) {
            expect(e.message).toContain("VM error while processing transaction")
        }

    })*/

    /*it("should reject votings with 1/3 confirmed votes", async function() {
        const testContract = await VotingToken.deployed()
        //set time back to 0
        await testContract.setCurrentTime.sendTransaction(1200000)

        // await testContract.buy.sendTransaction({from: accounts[1], value: 1000})
        // await testContract.buy.sendTransaction({from: accounts[2], value: 1000})
        // await testContract.buy.sendTransaction({from: accounts[3], value: 1000})

        await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
        // voteId should be 0
        console.log(+await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]}))
        await testContract.vote.sendTransaction(0, true, {from: accounts[1]})
        await testContract.vote.sendTransaction(0, false, {from: accounts[2]})
        await testContract.vote.sendTransaction(0, false, {from: accounts[3]})
        //await testContract.setCurrentTime.sendTransaction(1300000)
        await testContract.executeVoting.sendTransaction(0)
        const p = await testContract.getVoting.call(0);
        //console.log(p)
        expect(p[4]).toBe(true)
        expect(p[5]).toBe(false)
    })*/

    it("checks whether the voting gets finished after executing", async function() {
        const testContract = await VotingToken.deployed()
        await testContract.setCurrentTime.sendTransaction(1300000)
        try {
          await testContract.newVoting.sendTransaction(accounts[1], 29, 2, {from: accounts[6]})
          var voteId =  await testContract.vote.sendTransaction(1, true, {from: accounts[6]})
          await testContract.executeVoting(voteId)
          expect(+await testContract.getVoting(voteId)[4]).toBe(true)
          expect(+await testContract.getVoting(voteId)[1]).toBe(29)
          expect(+await testContract.getVoting(voteId)[0]).toBe(accounts[1])
          expect(+await testContract.getVoting(voteId)[5]).toBe(true)
      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })

    /*it("should check whether the inital voting is not passed and not finished", async function() {
      const testContract = await VotingToken.deployed()
      await testContract.setCurrentTime.sendTransaction(1300000)
      await testContract.newVoting.sendTransaction(accounts[1], 29, 2, {from: accounts[6]})
      var voteId =  await testContract.vote.sendTransaction(1, true, {from: accounts[6]})
      expect(+await testContract.getVoting(voteId)[5]).toBe(false)
      expect(+await testContract.getVoting(voteId)[6]).toBe(false)
      //expect(+await testContract.getNumVotings.call()).toBe(1)
    })*/

    it("should compute the right influence of tokenholder", async function() {
      const testVotingContract = await VotingToken.deployed()
      //const testAuctionContract = await AuctionToken.deployed()
      try {
        // initial FoW is Finance
        console.log(+await testVotingContract.getFieldOfWork.call())

        // set the FieldOfWork to Organisational instead of Finance
        await testVotingContract.setFieldOfWork(1)
        console.log(+await testVotingContract.getFieldOfWork.call())

        await testVotingContract.setCurrentTime.sendTransaction(1300000)
        //await testAuctionContract.setCurrentTime.sendTransaction(1300000)

        var voteId = await testVotingContract.newVoting.sendTransaction(accounts[1], 20, 1, {from: accounts[5]})

        await testVotingContract.delegate.sendTransaction(1, accounts[1], {from: accounts[5]})
        //await testAuctionContract.delegate.call(FieldOfWork(testVotingContract.getFieldOfWork()), accounts[5])

        expect(+await getInfluenceOfVoter({from: accounts[1]}, Organisational)).toBe(10)
        //var influence = await testAuctionContract.getInfluenceOfVoter.call(accounts[1], Finance)

      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })

    it("should instantiate a new voting", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1300000)
        var voting = await testContract.newVoting.call(accounts[0], 10, 2)
        var voteId =  await testContract.vote.sendTransaction(1, true, {from: accounts[6]})
        expect(+await testContract.getVoting(voteId)[1]).toBe(10)
      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })

    it("should pass the voting when the tokenholder has delegated his vote", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1400000)

        //await testContract.buy.sendTransaction({from: accounts[7], value: 20})

        // delegate voting power in FoW Finance from user 1 to user 0
        //console.log(+await testContract.getFieldOfWork())
        console.log('delegate')
        console.log(+await testContract.getFieldOfWork())
        await testContract.delegate.sendTransaction(testContract.getFieldOfWork(), accounts[3], {from: accounts[1]})
        // console.log(+await testContract.newVoting.sendTransaction(accounts[1], 200, 0, {from: accounts[2]}))
        // await testContract.vote.sendTransaction(1, true, {from: accounts[0]})
        // await testContract.vote.sendTransaction(1, false, {from: accounts[1]})
        //
        // const p = await testContract.getVoting.call(1);
        // console.log(p)
        // expect(p[4]).toBe(true)
        // expect(p[5]).toBe(true)

        //const boughtAmount1 = await testContract.buy.call({from: accounts[0], value: 10})

        //expect(+await getInfluenceOfVoter({from: accounts[0]}, Finance)).toContain(0)
        //expect(+await getInfluenceOfVoter({from: accounts[1]}, Finance)).toContain(10)

      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction")
      }
    })

    /*it("should fail the delegation if the token holder isn't a shareholder", async function() {
      const votingContract = await VotingToken.deployed()
      const testContract = await getTestToken()
      await votingContract.setCurrentTime.sendTransaction(1200000)
      try {
        // account[9] is not a shareholder
        console.log(!!+await votingContract.isShareholder.call(accounts[9]))
        console.log(+await votingContract.getFieldOfWork.call())
        console.log(+await testContract.getFieldOfWork())
        await testContract.delegate.call(testContract.getFieldOfWork(), accounts[9])
        should.fail("this transaction should have raised an error")
      } catch(e) {
        //console.log("asdf")
        expect(e.message).toContain("VM Exception while processing transaction: ")
      }


    })*/

    it("should create a new voting", async function() {
      const testContract = await VotingToken.deployed()
      await testContract.setCurrentTime.sendTransaction(1600000)
      var numberOfInitialVotings = 0;
      // return a new voting with id = 14 => number of voting from getNumVoting() = 14
      console.log("create new voting")
      console.log(+await testContract.newVoting.call(accounts[0], 100, 2))
      //console.log(+await testContract.newVoting.sendTransaction(accounts[0], 100, 2,{from: accounts[1]}))
      await testContract.newVoting.call(accounts[0], 100, 2)
      expect(numberOfInitialVotings + 2).toBe(2)
    })


    it("should abort voting if you are not a shareholder", async function() {
      const testContract= await VotingToken.deployed()
      await testContract.setCurrentTime.sendTransaction(1600000)

      // send money to account in order to become a shareholder
      //await testAuctionContract.buy.sendTransaction({from: accounts[1]}, value: web3.toWei(10, 'Gwei')})
      //console.log(+await testContract.isShareholder.call(accounts[5]))

      // check whether the account is a shareholder
      // !! converts 0 or 1 to false or true
      expect(!!+await testContract.isShareholder.call(accounts[5])).toBe(false)
    })

    // from AuctionToken
    it("should not be possible to compute a buyPrice when the ICO is not running", async function() {
      const testContract = await getTestToken()

      await testContract.setCurrentTime.sendTransaction(1000000-1)
      await expect(testContract.getBuyPrice.call()).rejects.toEqual(expect.any(Error)) // see: https://github.com/facebook/jest/issues/3601
      await testContract.setCurrentTime.sendTransaction(2000000)
      await expect(testContract.getBuyPrice.call()).rejects.toEqual(expect.any(Error))
    })


    it("schould reject votings with 1/3 confirmed votes", async function() {
        const testContract = await VotingToken.deployed()
        try {
            await testContract.setCurrentTime.sendTransaction(1300000)
            await testContract.newVoting.sendTransaction(accounts[1], 100, 2,{from: accounts[1]})
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

    /*it("should approve the voting with 3/5 confirmed votes", async function() {
      const testContract = await VotingToken.deployed()
      await testContract.setCurrentTime.sendTransaction(1400000)

      console.log("approve the voting with 3/5 confirmed votes")
      console.log(+await testContract.newVoting.call(accounts[0], 100, 2))
      var voteId = await testContract.newVoting.call(accounts[0], 100, 2)
      await testContract.vote.sendTransaction(voteId, true, {from: accounts[0]})
      // await testContract.vote.sendTransaction(12, true, {from: accounts[1]})
      // await testContract.vote.sendTransaction(12, true, {from: accounts[2]})
      // await testContract.vote.sendTransaction(12, false, {from: accounts[3]})
      // await testContract.vote.sendTransaction(12, false, {from: accounts[4]})
      // await testContract.setCurrentTime.sendTransaction(1500000)
      // const proposal = await testContract.getVoting.call(2);
      // expect(proposal[4]).toBe(true)
      // expect(proposal[5]).toBe(true)
    })*/

    it("should count the correct number of votings", async function() {
      const testContract = await VotingToken.deployed()
      //console.log(await testContract.getNumVotings.call().toNumber())
      const numberOfInitialVotings = (+await testContract.getNumVotings.call())
      await testContract.newVoting.sendTransaction(accounts[5], 10, 2, {from: accounts[6]})
      await testContract.newVoting.sendTransaction(accounts[4], 20, 2, {from: accounts[7]})
      await testContract.newVoting.sendTransaction(accounts[7], 3, 2, {from: accounts[0]})
      expect(+await testContract.getNumVotings.call()).toBe(6 + numberOfInitialVotings)
    })

    /*it("should allow to vote for a tokenholder", async function() {
        const testContract = await VotingToken.deployed()
        var voteId = await testContract.newVoting.sendTransaction(accounts[1], 10, 1, {from: accounts[2]})
        console.log(voteId)
        // undefined
        console.log(testContract.votings[1])
        await testContract.vote.sendTransaction(voteId, true, {from: accounts[0]})
        await testContract.vote.sendTransaction(voteId, true, {from: accounts[1]})
        await testContract.vote.sendTransaction(voteId, false, {from: accounts[2]})
        expect(testContract.votings[voteId].votes.length).toBe(3)
        expect(testContract.votings[voteId].voted).toBe(true)
    })*/

    /*it("should allow delegation to other users", async function() {
        const testContract = await VotingToken.deployed()
        // Set time between ICO start and END
        await testContract.setCurrentTime.sendTransaction(1200000)
        // Let three users buy token
        await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
        await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
        await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
        // Set time to after ICO
        await testContract.setCurrentTime.sendTransaction(2200000)
        // Create Voting in Field of work 2
        await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
        // User 2 delegates power in Field of Work 2 to User 3
        await testContract.delegate.sendTransaction(2, accounts[3], {from: accounts[2]})
        // User 1 and User 3 Vote
        await testContract.vote.sendTransaction(0, false, {from: accounts[1]})
        await testContract.vote.sendTransaction(0, true, {from: accounts[3]})
        // Set time to after the voting period
        await testContract.setCurrentTime.sendTransaction(2300000)
        // End Voting
        await testContract.executeVoting.sendTransaction(0)
        // Get voting details
        const p = await testContract.getVoting.call(0);
        // Voting should pass with 55 %
        expect(p[6]).toBe(55)
        console.log(p)
    })*/

    it("delegation in one field should not affect the others", async function() {
        const testContract = await VotingToken.deployed()

        // Set time between ICO start and END
        await testContract.setCurrentTime.sendTransaction(1200000)
        // Let three users buy token
        await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
        await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
        await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
        // Set time to after ICO
        await testContract.setCurrentTime.sendTransaction(2200000)
        // Create Voting in Field of work 2
        await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
        // User 2 delegates power in all Field of Works except 2 to User 3
        await testContract.delegate.sendTransaction(0, accounts[3], {from: accounts[2]})
        await testContract.delegate.sendTransaction(1, accounts[3], {from: accounts[2]})
        await testContract.delegate.sendTransaction(3, accounts[3], {from: accounts[2]})
        // User 1 and User 3 Vote
        await testContract.vote.sendTransaction(0, false, {from: accounts[1]})
        await testContract.vote.sendTransaction(0, true, {from: accounts[3]})
        // Set time to after the voting period
        await testContract.setCurrentTime.sendTransaction(2300000)
        // End Voting
        await testContract.executeVoting.sendTransaction(0)
        // Get voting details
        const p = await testContract.getVoting.call(0);
        // Voting should pass with 33 %
        expect(p[6]).toBe(33)
    })

    /*it("delegation after ending a vote should not have an effect on the vote", async function() {
        const testContract = await VotingToken.deployed()
        // Set time between ICO start and END
        await testContract.setCurrentTime.sendTransaction(1200000)
        // Let three users buy token
        await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
        await testContract.buy.sendTransaction({from: accounts[2], value: 3000})
        await testContract.buy.sendTransaction({from: accounts[3], value: 2000})
        // Set time to after ICO
        await testContract.setCurrentTime.sendTransaction(2200000)
        // Create Voting in Field of work 2
        await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
        // User 1 and User 3 Vote
        await testContract.vote.sendTransaction(0, false, {from: accounts[1]})
        await testContract.vote.sendTransaction(0, true, {from: accounts[3]})
        // Set time to after the voting period
        await testContract.setCurrentTime.sendTransaction(2300000)
        // End Voting
        await testContract.executeVoting.sendTransaction(0)
        // User 2 delegates power in Field of Work 2 to User 3
        await testContract.delegate.sendTransaction(2, accounts[0], {from: accounts[2]})
        // Get voting details
        const p = await testContract.getVoting.call(0);
        // Voting should pass with 33 %
        expect(p[6]).toBe(33)
        console.log(p)
    })*/

    it("users that are not shareholders should not be able to vote", async function() {
        const testContract = await VotingToken.deployed()

        // Set time between ICO start and END
        await testContract.setCurrentTime.sendTransaction(1200000)
        // Let three users buy token
        await testContract.buy.sendTransaction({from: accounts[1], value: 4000})
        console.log("asdf")
        // Set time to after ICO
        await testContract.setCurrentTime.sendTransaction(2200000)
        console.log("asdf")
        // Create Voting in Field of work 2
        await testContract.newVoting.sendTransaction(accounts[1], 100, 2, {from: accounts[1]})
        console.log("asdf")
        // User 1 and User 3 Vote
        await testContract.vote.sendTransaction(0, false, {from: accounts[1]})
        console.log("asdf")
        await testContract.vote.sendTransaction(0, false, {from: accounts[2]})
        await testContract.vote.sendTransaction(0, true, {from: accounts[3]})
        console.log("asdf")
    })

    it("tests that user become shareholer only if they buy some shares", async function() {
        const testContract = await getTestToken()

        // Set time between ICO start and END
        await testContract.setCurrentTime.sendTransaction(1200000)
        // Let three users buy token
        const isSharehoder1 = await testContract.isShareholder.call(accounts[7]);
        expect(!!isSharehoder1).toBe(false);
        await testContract.buy.sendTransaction({from: accounts[2], value: 4000})
        const isSharehoder2 = await testContract.isShareholder.call(accounts[2]);
        expect(!!isSharehoder2).toBe(true);
    })
});
