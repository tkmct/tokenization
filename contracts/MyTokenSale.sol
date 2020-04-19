pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Crowdsale.sol";
import "./KycContract.sol";


contract MyTokenSale is Crowdsale {
    KycContract kyc;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    ) public Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(
            kyc.kycCompleted(beneficiary),
            "KYC not completed yet, aborting"
        );
    }
}
