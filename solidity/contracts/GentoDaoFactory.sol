pragma solidity ^0.4.8;

//Contract Factory
import './GentoDao.sol';
contract GentoDaoFactory {

    address[] public DAOs;

    event DAOCreated(address contractAddress);

    function getDAOs() returns (address[] daos) {
        return DAOs;
    }

    function createDAO(uint256 totalSupply,
                            string symbol,
                            string name,
                            uint256 buyPriceStart,
                            uint256 buyPriceEnd,
                            uint256 saleStart,
                            uint256 saleEnd,
                            uint8 finance,
                            uint8 product,
                            uint8 organisational,
                            uint8 partner
                            ) returns (address contractAddress){

        GentoDao gentoDao = new GentoDao(totalSupply,
                                            symbol,
                                            name,
                                            buyPriceStart,
                                            buyPriceEnd,
                                            saleStart,
                                            saleEnd,
                                            finance,
                                            product,
                                            organisational,
                                            partner,
                                            true);

        address auctionAddress = address(gentoDao);
        DAOs.push(auctionAddress);
        DAOCreated(auctionAddress);
        return auctionAddress;
    }

}
