pragma solidity ^0.4.8;
// import "AuctionToken.sol.sol";

//Contract Factory
import './AuctionToken.sol';
contract GenToFactory {

    /*Mapping to store every ICO to from a specific owner*/
    mapping(address => address[]) userICOs;

    event ContractCreated(address owner, address contractAddress);

    /* this function is executed at initialization and sets the owner of the contract */
    function GenToFactory() {
    }

    function createContract(uint256 totalSupply,
                            string _symbol,
                            string _name,
                            uint256 _buyPriceStart,
                            uint256 _buyPriceEnd,
                            uint256 _sellPrice,
                            uint256 _saleStart,
                            uint256 _saleEnd) returns (address contractAddress){
        address _owner = msg.sender;

        AuctionToken auctionToken = new AuctionToken(totalSupply,
                                                     _owner,
                                                     _symbol,
                                                     _name,
                                                     _buyPriceStart,
                                                     _buyPriceEnd,
                                                     _sellPrice,
                                                     _saleStart,
                                                     _saleEnd,
                                                     false);
        address auctionAddress = address(auctionToken);
        userICOs[_owner].push(auctionAddress);
        ContractCreated(_owner, auctionAddress);
        return auctionAddress;
    }

    function getICOsFromOwner(address _owner) constant public returns(address[]){
        return userICOs[_owner];
    }
}
