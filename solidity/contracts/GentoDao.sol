pragma solidity ^0.4.8;

import './DaoWithDelegation.sol';

contract GentoDao is DaoWithDelegation {

    mapping(address => mapping(uint => uint256)) public votingRewardTokens;
    mapping(address => uint256) public dividends;
    mapping(address => uint256) public decisionmakerRewards;

    uint8 finance;
    uint8 product;
    uint8 organisational;
    uint8 partner;

    event Claimed(string claimType, address beneficiary, uint amount);
    event Balance(uint balance);

    function GentoDao(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    uint8 _finance,
    uint8 _product,
    uint8 _organisational,
    uint8 _partner,
    bool _dev) DaoWithDelegation(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
        finance = _finance;
        product = _product;
        organisational = _organisational;
        partner = _partner;
    }

    function getTokenPrice() constant returns (uint tokenPrice) {
        tokenPrice = this.balance / totalSupply;
        NumberLogger("TokenPrice", tokenPrice);
        return tokenPrice;
    }

    function claimPayout(uint proposalNumber) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender
            && proposal.claimed[msg.sender] == false && proposal.amount > 0);

        require(msg.sender.send(proposal.amount));
        proposal.claimed[msg.sender] = true;
        Claimed("payout", msg.sender, proposal.amount);

        return proposal.amount;
    }

    function claimDividend() public onlyShareholders {
        require(dividends[msg.sender] > 0);
        dividends[msg.sender] = 0;
        require(msg.sender.send(dividends[msg.sender]));
        
        Claimed("dividend", msg.sender, dividends[msg.sender]);
    }


    function claimDecisionMakerReward() public onlyShareholders {
        require(decisionmakerRewards[msg.sender] > 0);
        decisionmakerRewards[msg.sender] = 0;
        require(msg.sender.send(decisionmakerRewards[msg.sender]));

        Claimed("decision maker reward", msg.sender, decisionmakerRewards[msg.sender]);
    }

    function getVRTokenInFoW(FieldOfWork fow) public constant returns(uint vrt) {
        uint vrt1 = 0;
        for (uint i = 0; i < shareholders.length; ++i) {
            if (votingRewardTokens[shareholders[i]][uint(fow)] > 0) {
                vrt1 += votingRewardTokens[shareholders[i]][uint(fow)];
            }
        }
        // check for 0 and setting to any number so the calculation doesn't throw
        if (vrt1 == 0) {
            vrt1 = 1;
        }
        return vrt1;
    }

    function getVRTokenInFoWOfDecisionMaker(address dm, FieldOfWork fow) public constant returns(uint vrt) {
        return votingRewardTokens[dm][uint(fow)];
    }

    function distributeDMReward(uint dmr) {
        uint financeDmr = (dmr * finance) / 100;
        uint productDmr = (dmr * product) / 100;
        uint organisationalDmr = (dmr * organisational) / 100;
        uint partnerDmr = (dmr * partner) / 100;


        for (uint j = 0; j < shareholders.length; ++j) {
            uint financeReward = (financeDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Finance) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Finance))) / 100;
            uint organisationalReward = (organisationalDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Organisational) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Organisational))) / 100;
            uint productReward = (productDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Product) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Product))) / 100;
            uint partnerReward = (partnerDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Partnership) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Partnership))) / 100;
            
            uint dmr = financeReward + productReward + organisationalReward + partnerReward;

            decisionmakerRewards[shareholders[j]] = dmr;
        }

        for (uint l = 0; l < shareholders.length; ++l) {
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Finance)] = 0;
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Product)] = 0;
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Organisational)] = 0;
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Partnership)] = 0;
        }
    }

    function distributeDividend(uint dividend) {
        uint tokenPrice = getTokenPrice();
        for (uint i = 0; i < shareholders.length; ++i) {
            uint shareholderDividend = ((balances[shareholders[i]] * tokenPrice) * dividend) / 100;
            dividends[shareholders[i]] += shareholderDividend;
        }
    }

    function executeProposal(uint proposalId) public votingAllowed {
        DaoWithProposals.executeProposal(proposalId);
        Proposal storage proposal = proposals[proposalId];

        if (proposal.proposalPassed) {
            if (proposal.dividend > 0) {
                distributeDividend(proposal.dividend);
            }
            if (proposal.dmr > 0) {
                distributeDMReward(proposal.dmr);
            }
        }
    }
}
