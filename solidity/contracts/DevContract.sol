pragma solidity ^0.4.8;

//This contract contains dev functionality

contract DevContract {


    event NumberLogger(string description, uint number);
    event AddressLogger(string description, address addr);

    bool internal active;
    uint internal cTime;

    function DevContract(bool _active) public {
        active = _active;
    }

    function currentTime() public constant returns (uint time) {
        if (active) {
            return cTime;
        } else {
            return now;
        }
    }

    function setCurrentTime(uint time) public {
        require(active);

        cTime = time;
    }

    function setProduction() {
        active = false;
    }
}
