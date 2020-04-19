pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Crowdsale.sol";


contract MyTokenSale is Crowdsale {
    constructor(uint256 rate, address payable wallet, IERC20 token)
        public
        Crowdsale(rate, wallet, token)
    {}
}
