pragma solidity ^0.4.8;

//Contract Factory
import './GentoDao.sol';
contract GentoDaoFactory {

    address[] public DAOs;

    event DAOCreated(address contractAddress);

    function getDAOs() public returns (address[] daos) {
        return DAOs;
    }

    function createDAO(uint256 totalSupply,
                            string symbol,
                            string name,
                            string descriptionHash,
                            uint256 buyPriceStart,
                            uint256 buyPriceEnd,
                            uint256 saleStart,
                            uint256 saleEnd
                            ) public returns (address contractAddress){

        GentoDao gentoDao = new GentoDao(totalSupply,
                                            symbol,
                                            name,
                                            descriptionHash,
                                            buyPriceStart,
                                            buyPriceEnd,
                                            saleStart,
                                            saleEnd,
                                            true);

        address auctionAddress = address(gentoDao);
        DAOs.push(auctionAddress);
        DAOCreated(auctionAddress);
        return auctionAddress;
    }

}
