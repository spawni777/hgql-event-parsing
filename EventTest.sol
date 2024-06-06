// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract EventTestContract {
  mapping(address => uint256) public callsNumber;
  mapping(address => uint256) public data;
  uint256 public totalCounter = 0;

  event Call(
    address indexed caller,
    uint256 addressCalls
  );

  event DataCall(
    address indexed caller,
    uint256 data
  );

  event TotalCounter(
    address indexed caller,
    uint256 totalContractCalls
  );

  function getSenderAddress() public view returns (address) {
    return msg.sender;
  }

  function call() external {
    if (callsNumber[msg.sender] > 0) {
      callsNumber[msg.sender] = callsNumber[msg.sender] + 1;
    } else {
      callsNumber[msg.sender] = 1;
    }

    emit Call(msg.sender, callsNumber[msg.sender]);

    totalCounter = totalCounter + 1;
    emit TotalCounter(msg.sender, totalCounter);
  }

  function dataCall(uint256 _data) external {
    this.call();

    data[msg.sender] = _data;
    emit DataCall(msg.sender, _data);
  }

  function getCallsNumber(address _address) public view returns (uint256) {
    uint256 calls = callsNumber[_address];

    if (calls == 0) {
      revert("There are no calls from this address");
    }

    return calls;
  }
}
