pragma solidity ^0.4.8;

import './DaoWithDelegation.sol';


contract GentoDao is DaoWithDelegation {
    string public descriptionHash;
    mapping(address => mapping(uint => uint256)) public votingRewardTokens;
    mapping(address => uint256) public dividends;
    mapping(address => uint256) public decisionmakerRewards;

    uint8 finance = 25;
    uint8 product = 25;
    uint8 organisational = 25;
    uint8 partner = 25;

    event Claimed(string claimType, address beneficiary, uint amount);

    function GentoDao(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    string _descriptionHash,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) DaoWithDelegation(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
        descriptionHash = _descriptionHash;
    }

    function claimPayout(uint proposalNumber) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender
            && proposal.claimed[msg.sender] == false && proposal.amount > 0);

        /* require(msg.sender.send(proposal.amount)); */
        proposal.claimed[msg.sender] = true;
        Claimed("payout", msg.sender, proposal.amount);

        return proposal.amount;
    }

    function claimDividend() public onlyShareholders {
        require(dividends[msg.sender] > 0);
        uint dividend = dividends[msg.sender];
        dividends[msg.sender] = 0;
        require(msg.sender.send(dividend));

        Claimed("dividend", msg.sender, dividends[msg.sender]);
    }

    // wie bekommt jeder user DMR?
    function claimDecisionMakerReward(uint proposalNumber) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];
        require(decisionmakerRewards[msg.sender] > 0);
        decisionmakerRewards[msg.sender] = 0;
        require(msg.sender.send(decisionmakerRewards[msg.sender]));
        proposal.claimed[msg.sender] = true;
        Claimed("decision maker reward", msg.sender, decisionmakerRewards[msg.sender]);
    }

    function getVRTokenInFoW(FieldOfWork fow) public constant returns(uint vrt) {
        uint vrt1 = 0;
        NumberLogger("shareholders.length", shareholders.length);
        for (uint i = 0; i < shareholders.length; ++i) {
            if (votingRewardTokens[shareholders[i]][uint(fow)] > 0) {
                vrt1 += votingRewardTokens[shareholders[i]][uint(fow)];
            }
        }
        // check for 0 and setting to any number so it doesn't throw
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

            uint dmrSum = financeReward + productReward + organisationalReward + partnerReward;

            decisionmakerRewards[shareholders[j]] = dmrSum;
        }

        for (uint l = 0; l < shareholders.length; ++l) {
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Finance)] = 0;
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Product)] = 0;
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Organisational)] = 0;
            votingRewardTokens[shareholders[l]][uint(FieldOfWork.Partnership)] = 0;
        }
    }

    function distributeDividend(uint dividend) {
        for (uint i = 0; i < shareholders.length; ++i) {
            uint shareholderDividend = (dividend * balances[shareholders[i]] * (10 ** 3)) / totalSupply / (10 ** 3);
            dividends[shareholders[i]] += shareholderDividend;
        }
    }

    function executeProposal(uint proposalId) public votingAllowed {
        DaoWithProposals.executeProposal(proposalId);
        Proposal storage proposal = proposals[proposalId];
        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
            votingRewardTokens[v.voter][uint(proposal.fieldOfWork)] += voteWeight;
        }
        // finished?
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
