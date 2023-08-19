// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/ETH
     * Address: 0x9E37B8c45D11b86E090aEFc180CCA972f8FEc627
     */
    // event returnValue(address contractAddress);
    constructor () {
        priceFeed = AggregatorV3Interface(0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (,int price,,,) = priceFeed.latestRoundData();
        // emit returnValue(0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22);
        return price;
    }
}
