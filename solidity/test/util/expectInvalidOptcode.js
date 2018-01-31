const should = require('should');
const expect = require('expect');
module.exports = async (promise, message) => {
    try {
      await promise
      should.fail("this promise should have thrown an error")
    }
    catch(e) {
      expect(e.message).toContain("VM Exception while processing transaction:")
    }
  }
