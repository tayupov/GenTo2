pragma solidity ^0.4.8;

//Contract Factory
import './GentoDao.sol';
contract GentoDaoFactory {

    address[] public ICOs;

    event ContractCreated(address contractAddress);

    function getICOs() returns (address[] icos) {
        return ICOs;
    }

    function createContract(uint256 totalSupply,
                            string symbol,
                            string name,
                            uint256 startPrice,
                            uint256 endPrice,
                            uint256 saleStart,
                            uint256 saleEnd) returns (address contractAddress){

        GentoDao gentoDao = new GentoDao(totalSupply,
                                                     symbol,
                                                     name,
                                                     startPrice,
                                                     endPrice,
                                                     0,
                                                     saleStart,
                                                     saleEnd,
                                                     true); // This allows time warping!

        address auctionAddress = address(gentoDao);
        ICOs.push(auctionAddress);
        ContractCreated(auctionAddress);
        return auctionAddress;
    }

}
