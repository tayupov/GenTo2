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

/*
method signatures:

newVoting.sendTransaction(account, value, {from})
buy.sendTransaction({from, value})
vote.sendTransaction(voteId, supportsVoting, {from})
executeVoting.sendTransaction(voteId, {from})

setFieldOfWork() without call()!

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
        try {
            //set time back to 0
            await testContract.setCurrentTime.sendTransaction(1300000)
            // create 2 votings with id 0 and 1
            const numberOfInitialVotings = 0;
            await testContract.newVoting.sendTransaction(accounts[1], 100, {from: accounts[1]})
            // per transaction it creates two votings not one! => add 2 not 1
            expect(+await testContract.getNumVotings.call()).toBe(2 + numberOfInitialVotings)
            await testContract.newVoting.sendTransaction(accounts[1], 200, {from: accounts[1]})
            expect(+await testContract.getNumVotings.call()).toBe(4 + numberOfInitialVotings)
            await testContract.newVoting.sendTransaction(accounts[1], 300, {from: accounts[1]})
            expect(+await testContract.getNumVotings.call()).toBe(6)
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
            //console.log(p)
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
            //console.log(p)
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

    /*it("should compute the right influence of tokenholder", async function() {
      const testVotingContract = await VotingToken.deployed()
      const testAuctionContract = await AuctionToken.deployed()
      try {
        console.log(+await testVotingContract.getFieldOfWork.call())
        // set the FieldOfWork to Organisational instead of Finance
        await testVotingContract.setFieldOfWork(1)
        console.log(+await testVotingContract.getFieldOfWork.call())

        await testVotingContract.setCurrentTime.sendTransaction(1300000)
        await testVotingContract.setCurrentTime.sendTransaction(1300000)

        var voteId = await testVotingContract.newVoting.sendTransaction(accounts[1], 20, {from: accounts[5]})
        await testAuctionContract.delegate.call(FieldOfWork(testVotingContract.getFieldOfWork()), accounts[5])
        //var influence = await testAuctionContract.getInfluenceOfVoter.call(accounts[1], Finance)
        //console.log(influence)
        //var voting = await testContract.getVoting(voteId)
      } catch(e) {
          expect(e.message).toContain("VM Exception while processing transaction: ")
      }
    })*/

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
      const votingContract = await VotingToken.deployed()
      const auctionContract = await AuctionToken.deployed()
      try {
        await votingContract.setCurrentTime.sendTransaction(1400000)
        await auctionContract.delegate(votingContract.getFieldOfWork(), accounts[0])


        //const boughtAmount1 = await testContract.buy.call({from: accounts[0], value: 10})

        //expect(+await getInfluenceOfVoter({from: accounts[0]}, Finance)).toContain(0)
        //expect(+await getInfluenceOfVoter({from: accounts[1]}, Finance)).toContain(10)

      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction")
      }
    })*/

    /*it("should fail the delegation if the token holder isn't a shareholder", async function() {
      const votingContract = await VotingToken.deployed()
      const testContract = await getTestToken()
      await testContract.setCurrentTime.sendTransaction(1200000)
      try {
        // account[9] is not a shareholder
        //console.log(!!+await testContract.isShareholder.call(accounts[9]))

        await testContract.delegate.call(votingContract.getFieldOfWork.call(), accounts[9])
        should.fail("this transaction should have raised an error")
      } catch (e) {
        expect(e.message).toContain("VM Exception while processing transaction: ")
      }


    })*/

    it("should create a new voting", async function() {
      const testContract = await VotingToken.deployed()
      await testContract.setCurrentTime.sendTransaction(1600000)
      try {
        var numberOfInitialVotings = 0;
        // return a new voting with id = 14 => number of voting from getNumVoting() = 14
        console.log(+await testContract.newVoting.call(accounts[0], 100))
        await testContract.newVoting.call(accounts[0], 100)
        expect(numberOfInitialVotings + 2).toBe(2)
      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction: new voting isn't created")
      }
    })


    it("should abort voting if you are not a shareholder", async function() {
      const testContract= await VotingToken.deployed()
      try {
        await testContract.setCurrentTime.sendTransaction(1600000)

        // send money to account in order to become a shareholder
        //await testAuctionContract.buy.sendTransaction({from: accounts[1]}, value: web3.toWei(10, 'Gwei')})
        //console.log(+await testContract.isShareholder.call(accounts[5]))

        // check whether the account is a shareholder
        // !! converts 0 or 1 to false or true
        expect(!!+await testContract.isShareholder.call(accounts[5])).toBe(false)
      } catch(e) {
          expect(e.message).toContain("VM error while processing transaction")

      }
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
      //console.log(await testContract.getNumVotings.call().toNumber())
      try {
        const numberOfInitialVotings = (+await testContract.getNumVotings.call())
        await testContract.newVoting.sendTransaction(accounts[5], 10, {from: accounts[6]})
        await testContract.newVoting.sendTransaction(accounts[4], 20, {from: accounts[7]})
        await testContract.newVoting.sendTransaction(accounts[7], 3, {from: accounts[0]})
        expect(+await testContract.getNumVotings.call()).toBe(6 + numberOfInitialVotings)
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