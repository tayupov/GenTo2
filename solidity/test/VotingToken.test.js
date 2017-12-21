const VotingToken = artifacts.require("./AuctionToken.sol");
const AuctionToken = artifacts.require("./AuctionToken.sol");


const should = require('should');
const expect = require('expect');


async function getTestToken() {
  const testContract = await AuctionToken.deployed()
  //set time back to 0
  await testContract.setCurrentTime.sendTransaction(0)
  return testContract
}

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
        try {
            //set time back to 0
            await testContract.setCurrentTime.sendTransaction(1300000)
            // create 2 votings with id 0 and 1
            const numberOfInitialVotings = 0;
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            //expect(+await testContract.getNumVotings.call()).toBe(1 + numberOfInitialVotings)
            console.log(+await testContract.getNumVotings.call());
            await testContract.newVoting.sendTransaction(accounts[1], 200, {from: accounts[1]})
            //expect(+await testContract.getNumVotings.call()).toBe(2+ numberOfInitialVotings)
            await testContract.newVoting.sendTransaction(accounts[1], 300, {from: accounts[1]})
            expect(+await testContract.getNumVotings.call()).toBe(3 + numberOfInitialVotings)
        } catch (e) {
            expect(e.message).toContain("VM Exception while processing transaction: ")
        }
    })


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

    it("checks whether the proposal gets finished after executing", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1300000)
        await testContract.newVoting.sendTransaction(accounts[1], 29, {from: accounts[6]})
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

    it("should check whether the inital voting is not passed and not finished", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1300000)
        await testContract.newVoting.sendTransaction(accounts[1], 29, {from: accounts[6]})
        var voteId =  await testContract.vote.sendTransaction(1, true, {from: accounts[6]})
        expect(+await testContract.getVoting(voteId)[4]).toBe(false)
        expect(+await testContract.getVoting(voteId)[5]).toBe(false)
        //expect(+await testContract.getNumVotings.call()).toBe(1)

      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })

    it("should compute the right influence of tokenholder", async function() {
      const testVotingContract = await VotingToken.deployed()
      const testAuctionContract = await AuctionToken.deployed()
      try {
        await testVotingContract.setCurrentTime.sendTransaction(1300000)
        await testVotingContract.setCurrentTime.sendTransaction(1300000)

        var voteId = await testVotingContract.newVoting.sendTransaction(accounts[1], 20, {from: accounts[5]})
        await testAuctionContract.delegate.call(Finance, accounts[5])
        var influence = await testAuctionContract.getInfluenceOfVoter.call(accounts[1], Finance)
        console.log(influence)
        //var voting = await testContract.getVoting(voteId)
      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })

    it("should instantiate a new voting", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1300000)
        var voting = new testContract.newVoting.call(accounts[0], 10)
        var voteId =  await testContract.vote.sendTransaction(1, true, {from: accounts[6]})
        expect(+await testContract.getVoting(voteId)[1]).toBe(10)
      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })




    /*it("should pass the voting when the tokenholder has delegated his vote", async function() {
      const testContract = await VotingToken.deployed()
      try {
        console.log('test')

        await testContract.setCurrentTime.sendTransaction(1400000)
        await testContract.delegate.call(testContract.Finance, accounts[0], {from: accounts[1]})

        /*const boughtAmount1 = await testContract.buy.call({from: accounts[0], value: 10})

        expect(+await getInfluenceOfVoter({from: accounts[0]}, Finance)).toContain(0)
        expect(+await getInfluenceOfVoter({from: accounts[1]}, Finance)).toContain(10)

      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction")
      }
    })*/

    /*it("should fail the voting if the token holder doesn't purchased a share ", async function() {
      const testContract = await VotingToken.deployed()
      /*var noShareholder;
      for (acc in accounts) {
        if (!testContract.isShareholder(acc)) {
          noShareholder = acc;
          break;
        }
      }
      console.log(+await testContract.isShareholder.call(accounts[9]))
      console.log(accounts)
      console.log(+await testContract.buy.sendTransaction({from: accounts[9], value: web3.toWei(10, 'Gwei')}))


      try {
        await testContract.setCurrentTime.sendTransaction(1500000)

        //await testContract.buy.sendTransaction({from: , value: 10})
        should.fail("this transaction should have raised an error")

      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction: owner doesn't have a share")
      }
    })*/

    /*it("should create a new voting", async function() {
      const testContract = await VotingToken.deployed()
      try {
        console.log(+await testContract.newVoting.call(accounts[0], 100))
        +await testContract.newVoting.call(accounts[0], 100)
        expect(+await testContract.getNumVotings.call()).toBe(1)
        // .sendTransaction({from: accounts[0]}, 100, {to: accounts[1]}
        //expect(+await getNumVotings.call().toBe(numberOfInitialVotings + 1))
      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction: new voting isn't created")
      }
    })*/


    it("should allow voting only for shareholder", async function() {
      const testContract= await VotingToken.deployed()
      try {
        //console.log(accounts[0])
        //console.log(+await testContract.isShareholder(accounts[0]))
        expect(!!+await testContract.isShareholder.call(accounts[0])).toBe(true)
      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction")

      }
    })


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
            //create 3 votings with id = 0,1,2
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

    it("should approve the voting with 3/5 confirmed votes", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1400000)

        await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
        await testContract.vote.sendTransaction(1, true, {from: accounts[0]})
        await testContract.vote.sendTransaction(1, true, {from: accounts[1]})
        await testContract.vote.sendTransaction(1, true, {from: accounts[2]})
        await testContract.vote.sendTransaction(1, false, {from: accounts[3]})
        await testContract.vote.sendTransaction(1, false, {from: accounts[4]})
        await testContract.setCurrentTime.sendTransaction(1500000)
        const proposal = await testContract.getVoting.call(2);
        expect(proposal[4]).toBe(true)
        expect(proposal[5]).toBe(true)


      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })

    it("should count the correct number of votings", async function() {
      const testContract = await VotingToken.deployed()
      console.log(await testContract.getNumVotings.call().toNumber())
      try {
        const numberOfInitialVotings = (await testContract.getNumVotings.call().toNumber())
        await testContract.newVoting.sendTransaction(accounts[5], 10, {from: accounts[6]})
        await testContract.newVoting.sendTransaction(accounts[4], 20, {from: accounts[7]})
        await testContract.newVoting.sendTransaction(accounts[7], 3, {from: accounts[0]})
        expect(+await testContract.getNumVotings).toBe(3 + numberOfInitialVotings)
      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })

    it("should allow to vote for a tokenholder", async function() {
      const testContract = await VotingToken.deployed()
      try {
        await testContract.vote.sendTransaction(0, true, {from: accounts[0]})
        await testContract.vote.sendTransaction(0, true, {from: accounts[1]})
        await testContract.vote.sendTransaction(0, false, {from: accounts[2]})
        expect(votings[votingNumber].votes.length).toBe(3)
        expect(votings[votingNumber].voted).toBe(true)
      } catch(e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })


});
