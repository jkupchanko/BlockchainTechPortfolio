// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Automation {

    uint public counter = 0;
    uint public lastExecutionTime;
    uint public constant interval = 10 seconds;

    function pressCounter() public {
        require(block.timestamp >= lastExecutionTime + interval, "10 seconds not elapsed yet.");
        lastExecutionTime = block.timestamp;
        counter += 1;
    }

    function viewCounter() public view returns(uint) {
        return counter;
    }

    function getTimeLeft() public view returns (uint) {
        if (block.timestamp >= lastExecutionTime + interval) {
            return 0;
        }
        return lastExecutionTime + interval - block.timestamp;
    }
}
