const Token = artifacts.require('MyToken')

const chai = require('./chaisetup')
const BN = web3.utils.BN
const expect = chai.expect

contract('Token Test', async accounts => {
  const [ initialHolder, recipient, anotherAccount ] = accounts;
  let myToken

  beforeEach(async () => {
    myToken = await Token.new(1000)
  })

  it('all token should be in my account', async () => {
    const instance = myToken
    const totalSupply = await instance.totalSupply()

    return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply)
  })

  it('can send tokens from Account 1 to account 2', async () => {
    const sendTokens = 1
    const instance = myToken
    const totalSupply = await instance.totalSupply()
    expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply)
    expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled
    expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)))
    return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens))
  })

  it('is not possible to send more tokens than account 1 has', async () => {
    const instance = myToken
    const balance = await instance.balanceOf(initialHolder)
    expect(instance.transfer(recipient, new BN(balance + 1))).to.eventually.be.rejected
    return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balance)
  })
})
