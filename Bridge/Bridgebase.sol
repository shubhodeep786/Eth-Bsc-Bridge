// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './Itoken.sol';

contract BridgeBase {
  address public admin;
  IToken public token;
  uint public TransferID;
  mapping(uint => bool) public processedTransferID;

  enum Step { Burn, Mint }
  event Transfer(
    address from,
    address to,
    uint amount,
    uint date,
    uint TransferID,
    Step indexed step
  );

  constructor(address _token) {
    admin = msg.sender;
    token = IToken(_token);
  }

  function burn(address to, uint amount) external {
    token.burn(msg.sender, amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      TransferID,
      Step.Burn
    );
    TransferID++;
  }

  function mint(address to, uint amount, uint otherChainTransferID) external {
    require(msg.sender == admin, 'only admin');
    require(processedTransferID[otherChainTransferID] == false, 'transfer already processed');
    processedTransferID[otherChainTransferID] = true;
    token.mint(to, amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      otherChainTransferID,
      Step.Mint
    );
  }
}
