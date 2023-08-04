// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract HelloWorld {
  string public greeting;
  constructor(string memory _greeting) {
    greeting = _greeting;
  }

  function setGreeting(string memory _greeting) public {
    greeting = _greeting;
  }

  function sayHello() public view returns (string memory) {
    return greeting;
  }
}
