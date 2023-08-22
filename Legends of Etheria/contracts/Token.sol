// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Token is ERC1155 {
    uint256 public amountOfToken = 7;
    uint256 private coolDownTimer = 60 seconds;
    mapping(uint256 => uint256) private lastMintTime;

    constructor() ERC1155("") {}

    function mintToken(uint256 tokenId) public {
        require(tokenId >= 0 && tokenId <= 2, "tokenId is out of range");
        require(block.timestamp >= lastMintTime[tokenId] + coolDownTimer, "You need to wait for the cooldown period!");

        _mint(msg.sender, tokenId, 1, "");
        lastMintTime[tokenId] = block.timestamp;


        

    }

    function mintTokens(uint256 tokenId) public {
        require(tokenId >= 3  && tokenId <= 6, "tokenId is out of range");

        if (tokenId == 3) {
            _burn(msg.sender, 0, 1);
            _burn(msg.sender, 1, 1);
        } else if (tokenId == 4) {
            _burn(msg.sender, 1, 1);
            _burn(msg.sender, 2, 1);
        } else if (tokenId == 5) {
            _burn(msg.sender, 0, 1);
            _burn(msg.sender, 2, 1);
        } else if (tokenId == 6) {
            _burn(msg.sender, 0, 1);
            _burn(msg.sender, 1, 1);
            _burn(msg.sender, 2, 1);
        } else {
            revert("Incorrect Option!");
        }
         _mint(msg.sender, tokenId, 1, "");
    }

    function forgingBurn(uint256 tokenId) external {
        require(tokenId >= 3 && tokenId <= 6, "Invalid input, pick between 3, 4, 5, or 6");

        if (tokenId == 3) {
            _burn(msg.sender, tokenId, 1);  
        } else if (tokenId == 4) {
            _burn(msg.sender, tokenId, 1); 
        } else if (tokenId == 5) {
            _burn(msg.sender, tokenId, 1); 
        } else if (tokenId == 6) {
            _burn(msg.sender, tokenId, 1);
        } else {
            revert("Incorrect Selection!");
        }
        
    }

    function tradeForToken(uint256 tokenId) public {
        require(tokenId >= 0 && tokenId <= 2, "tokenId is out of range");

        // Burn the specified tokenId
        _burn(msg.sender, tokenId, 1);

        // Mint a new token with ID in the range [0-2]
        _mint(msg.sender, tokenId, 1, "");

        // Update the last mint time for the new token
        lastMintTime[tokenId] = block.timestamp;
    }
  
}
