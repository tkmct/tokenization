const MyToken = artifacts.require('MyToken')
const MyTokenSale = artifacts.require('MyTokenSale')
const KycContract = artifacts.require('KycContract')

require('dotenv').config({ path: '../.env' })

module.exports = async deployer => {
  const addr = await web3.eth.getAccounts()
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS)
  await deployer.deploy(KycContract)
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, KycContract.address)
  const instance = await MyToken.deployed()
  instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS)
}