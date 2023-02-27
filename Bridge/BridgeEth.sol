// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Bridgebase.sol';

contract BridgeEth is BridgeBase {
  constructor(address token) BridgeBase(token) {}
}
