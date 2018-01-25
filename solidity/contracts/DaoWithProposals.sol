pragma solidity ^0.4.8;

import './DaoWithIco.sol';
contract DaoWithProposals is DaoWithIco {

    Proposal[] public proposals;
    uint public debatingPeriodInMinutes;
    enum FieldOfWork { Finance, Organisational, Product, Partnership }

    struct Proposal {
        address recipient;
        uint amount;
        string description;
        FieldOfWork fieldOfWork;
        uint proposalDeadline;
        bool finished;
        bool proposalPassed;
        uint passedPercent;
        bytes32 proposalHash;
        uint dividend;
        uint dmr;
        Vote[] votes;
        mapping (address => bool) voted;
        mapping (address => bool) claimed;
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
        debatingPeriodInMinutes = 10;  // TODO add to constructor
    }

    function getProposal(uint proposalID) public constant returns (address recipient,
    uint amount,
    string description,
    uint proposalDeadline,
    bool finished,
    bool proposalPassed,
    uint passedPercent,
    uint dividend,
    uint dmr) {
        Proposal storage proposal = proposals[proposalID];
        return (proposal.recipient, proposal.amount, proposal.description, proposal.proposalDeadline, proposal.finished,
            proposal.proposalPassed, proposal.passedPercent, proposal.dividend, proposal.dmr);
    }

    function getNumProposals() public constant returns (
        uint numOfProposals) {
        return proposals.length;
    }

    function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork) public constant returns (uint influence);

    function newProposalDividend(
        address beneficiary,
        uint dividend) public votingAllowed onlyShareholders
    returns(uint proposalID)
    {
        uint proposalDividendID = newProposal(beneficiary, 0, FieldOfWork.Finance);
        Proposal storage proposal  = proposals[proposalDividendID];
        proposal.dividend = dividend;
        return proposalDividendID;

    }

    function newDMRProposal(
        address beneficiary,
        uint dmr) public votingAllowed onlyShareholders
    returns(uint proposalID)
    {

        uint proposalDividendID = newProposal(beneficiary, 0, FieldOfWork.Finance);
        Proposal storage proposal  = proposals[proposalDividendID];
        proposal.dmr = dmr;
        return proposalDividendID;

    }

    function newProposal(
        address beneficiary,
        uint weiAmount,
        FieldOfWork fieldOfWork) public votingAllowed onlyShareholders
    returns (uint proposalID)
    {
        AddressLogger("BENEFICIARY", beneficiary);
        proposalID = proposals.length++;
        Proposal storage proposal = proposals[proposalID];
        proposal.recipient = beneficiary;
        proposal.amount = weiAmount;
        proposal.proposalHash = keccak256(beneficiary, weiAmount); // TODO add transactionBytecode
        proposal.proposalDeadline = currentTime() + debatingPeriodInMinutes * 1 minutes;
        proposal.finished = false;
        proposal.fieldOfWork = fieldOfWork;
        proposal.proposalPassed = false;
        proposal.dividend = 0;
        proposal.dmr = 0;
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

        uint approve = 0;
        uint disapprove = 0;

        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
            if (v.inSupport) {
                approve += voteWeight;
            } else {
                disapprove += voteWeight;
            }
        }
        proposal.finished = true;

        if (approve > disapprove) {
            // Proposal passed; execute the transaction
            proposal.proposalPassed = true;
        } else {
            // Proposal failed
            proposal.proposalPassed = false;
        }
        proposal.passedPercent = approve * 100 / (approve+disapprove);

        ProposalFinishedLogger(proposalId, approve+disapprove, approve, disapprove);
    }
}
