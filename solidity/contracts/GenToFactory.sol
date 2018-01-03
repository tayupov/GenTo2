pragma solidity ^0.4.8;

//Contract Factory
import './AuctionToken.sol';
contract GenToFactory {

    address[] public ICOs;

    event ContractCreated(address contractAddress);

    function getICOs() returns (address[] icos) {
        return ICOs;
    }

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
        ICOs.push(auctionAddress);
        ContractCreated(auctionAddress);
        return auctionAddress;
    }

}
