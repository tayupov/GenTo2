pragma solidity ^0.4.8;
// import "AuctionToken.sol.sol";

//Contract Factory
import './AuctionToken.sol';
contract GenToFactory {

    address[] userICOs;

    event ContractCreated(address contractAddress);

    function createContract(uint256 totalSupply,
                            string _symbol,
                            string _name,
                            uint256 _buyPriceStart,
                            uint256 _buyPriceEnd,
                            uint256 _sellPrice,
                            uint256 _saleStart,
                            uint256 _saleEnd) returns (address contractAddress){

        AuctionToken auctionToken = new AuctionToken(totalSupply,
                                                     _symbol,
                                                     _name,
                                                     _buyPriceStart,
                                                     _buyPriceEnd,
                                                     _sellPrice,
                                                     _saleStart,
                                                     _saleEnd,
                                                     false);
        address auctionAddress = address(auctionToken);
        userICOs.push(auctionAddress);
        ContractCreated(auctionAddress);
        return auctionAddress;
    }

}
