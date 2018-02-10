pragma solidity ^0.4.8;

import "./DaoWithIco.sol";
/* import {votingRewardTokens} from "./GentoDao.sol"; */


contract DaoWithProposals is DaoWithIco {

    Proposal[] public proposals;
    uint public debatingPeriod;
    enum FieldOfWork { Finance, Organisational, Product, Partnership }

    mapping(address => mapping(uint => uint256)) public votingRewardTokens;

    struct Proposal {
        address recipient;
        uint amount;
        string name;
        string description;
        FieldOfWork fieldOfWork;
        uint proposalStartTime;
        uint proposalDeadline;
        bool finished;
        bool proposalPassed;
        uint passedPercent;
        uint dividend;
        uint dmr;
        Vote[] votes;
        mapping (address => bool) voted;
        bool claimed;
    }

    struct Vote {
        bool inSupport;
        address voter;
    }

    event ProposalFinishedLogger(uint proposalId, uint totalVotes, uint approve, uint disapprove);
    event NewProposalCreated(uint proposalID);
    event Voted(uint proposalID, bool position, address voter);

    // Modifier that allows only shareholders to vote and create new proposals
    modifier onlyShareholders {
        require(isShareholder(msg.sender));
        _;
    }

    // Modifier checks whether the ICO is finished and if so the ICO become a DAO and voting is allowed
    modifier votingAllowed {
        require(isIcoFinished());
        _;
    }

    function DaoWithProposals(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) DaoWithIco(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
        debatingPeriod = 1 days;
    }

    function getProposal(uint proposalID) public constant returns (address recipient,
    uint amount,
    string name,
    string description,
    uint proposalDeadline,
    bool finished,
    bool proposalPassed,
    uint passedPercent,
    uint fieldOfWork,
    uint dividend,
    uint dmr) {
        Proposal storage proposal = proposals[proposalID];
        return (proposal.recipient, proposal.amount, proposal.name, proposal.description, proposal.proposalDeadline,
        proposal.finished, proposal.proposalPassed, proposal.passedPercent, uint(proposal.fieldOfWork), proposal
        .dividend, proposal.dmr);
    }
    function getVote(uint proposalID, address voter) public constant returns (bool voted, bool support) {
        Proposal storage proposal = proposals[proposalID];

        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];

            if (v.voter == voter) {
                return (true, v.inSupport);
            }
        }
        return (false, false);
    }

    function getNumProposals() public constant returns (
        uint numOfProposals) {
        return proposals.length;
    }

    function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork) public constant returns (uint influence);

    function newDividendProposal(
        string name,
        string description,
        uint dividend) public votingAllowed onlyShareholders
    returns(uint proposalID)
    {
        require(dividend > 0);
        require(dividend < this.balance);
        uint proposalDividendID = newProposal(name, description, address(0), 0, FieldOfWork.Finance);
        Proposal storage proposal  = proposals[proposalDividendID];
        proposal.dividend = dividend;
        return proposalDividendID;

    }

    function newDMRewardProposal(
        string name,
        string description,
        uint dmr) public votingAllowed onlyShareholders
    returns(uint proposalID)
    {
        require(dmr > 0);
        require(dmr < this.balance);
        uint proposalDividendID = newProposal(name, description, address(0), 0, FieldOfWork.Finance);
        Proposal storage proposal  = proposals[proposalDividendID];
        proposal.dmr = dmr;
        return proposalDividendID;

    }

    function newProposal(
        string name,
        string description,
        address beneficiary,
        uint weiAmount,
        FieldOfWork fieldOfWork) public votingAllowed onlyShareholders
    returns (uint proposalID)
    {
        require((weiAmount > 0 && beneficiary != address(0)) || (weiAmount == 0 && beneficiary == address(0)));
        proposalID = proposals.length++;
        Proposal storage proposal = proposals[proposalID];
        proposal.recipient = beneficiary;
        proposal.name = name;
        proposal.description = description;
        proposal.amount = weiAmount;
        proposal.proposalStartTime  = currentTime();
        proposal.proposalDeadline = currentTime() + debatingPeriod;
        proposal.finished = false;
        proposal.fieldOfWork = fieldOfWork;
        proposal.proposalPassed = false;
        proposal.dividend = 0;
        proposal.dmr = 0;
        proposal.claimed = false;
        NewProposalCreated(proposalID);
        return proposalID;
    }

    function vote(
        uint proposalNumber,
        bool supportsProposal
    ) public votingAllowed onlyShareholders
    returns (uint voteID)
    {
        Proposal storage proposal = proposals[proposalNumber];
        require(proposal.voted[msg.sender] != true);
        require(currentTime() < proposal.proposalDeadline);
        require(!proposal.finished);

        voteID = proposal.votes.length++;
        proposal.votes[voteID] = Vote({inSupport: supportsProposal, voter: msg.sender});
        proposal.voted[msg.sender] = true;
        Voted(proposalNumber, supportsProposal, msg.sender);
        return voteID;
    }

    function executeProposal(uint proposalId) public votingAllowed
    {
        Proposal storage proposal = proposals[proposalId];

        require(currentTime() > proposal.proposalDeadline                       // If it is past the proposal deadline
            && !proposal.finished);                                             // and it has not already been finished
            // && proposal.proposalHash == sha3(proposal.recipient, proposal.amount)); // and the supplied code matches

        var (approve, disapprove, passedPercent, proposalStartTime, proposalDeadline, curTime) = calculateVotingStatistics(proposalId);
        assignDMRRewards(proposalId);
        proposal.finished = true;

        proposal.proposalPassed =  (approve > disapprove);
        proposal.passedPercent = passedPercent;

        ProposalFinishedLogger(proposalId, approve+disapprove, approve, disapprove);
    }

    function assignDMRRewards(uint proposalId) internal {
      Proposal storage proposal = proposals[proposalId];
      for (uint i = 0; i < proposal.votes.length; ++i) {
          Vote storage v = proposal.votes[i];
          uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
      }
    }

    function calculateVotingStatistics(uint proposalId)  public constant returns (uint currentApprove, uint currentDisapprove,
    uint currentPercent, uint proposalStartTime, uint proposalDeadline, uint curTime){
        uint approve = 0;
        uint disapprove = 0;

        Proposal storage proposal = proposals[proposalId];
        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
        //    votingRewardTokens[v.voter][uint(proposal.fieldOfWork)] += voteWeight;
            if (v.inSupport) {
                approve += voteWeight;
            } else {
                disapprove += voteWeight;
            }
        }
        uint percent = 0;
        if(approve+disapprove > 0){ // If no one voted, just show 0%
            percent = approve * 100 / (approve+disapprove);
        }

        return (approve, disapprove, percent, proposal.proposalStartTime, proposal.proposalDeadline, currentTime());
    }
}
