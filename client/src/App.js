import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";


import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    loaded: false,
    web3: null,
    accounts: null,
    myToken: null,
    myTokenSale: null,
    kycContract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = 5777

      console.log(MyToken.networks)
      const myToken = new web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[networkId] && MyToken.networks[networkId].address
      );

      const myTokenSale = new web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address
      );

      const kycContract = new web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[networkId] && KycContract.networks[networkId].address
      );

      this.setState({ loaded: true, web3, accounts, myToken, myTokenSale, kycContract }, this.fetchUserTokens);
      this.listenToTokenTransfer()
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  fetchUserTokens = async () => {
    const userTokens = await this.state.myToken.methods.balanceOf(this.state.accounts[0]).call()
    this.setState({ userTokens })
  }

  listenToTokenTransfer = async () => {
    this.state.myToken.events.Transfer({ to: this.state.accounts[0] }).on('data', this.fetchUserTokens)
  }

  handleKycSubmit = async () => {
    const { kycAddress } = this.state
    await this.state.kycContract.methods.setKycCompleted(kycAddress).send({ from: this.state.accounts[0] })
    alert(`Account ${kycAddress} is now whitelisted`)
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <h1>Capuccino Token for StarDucks</h1>
        <div>
          <h2>Enable your account</h2>
          <p>
            Address to allow:
              <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
              <button onClick={this.handleKycSubmit}>Add to Whitelist</button>
          </p>
          <p>
            Try changing the value stored on <strong>line 40</strong> of App.js.
          </p>
        </div>
        <div>
          <h2>Buy cappucino-tokens</h2>
          <p>Send Ether to this address: {this.state.myTokenSale._address}</p>
        </div>

        User now has {this.state.userTokens} CAPPU

      </div>
    )
  }
}

export default App;
