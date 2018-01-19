pragma solidity ^0.4.8;

contract Proposals {

    uint public debatingPeriodInMinutes;

    Proposal[] public proposals;

    uint public numProposals;

    enum FieldOfWork { Finance, Organisational, Product, Partnership }

    FieldOfWork public fow = FieldOfWork.Finance;


    struct Proposal {
        address recipient;
        uint amount;
        string name;
        string description;
        FieldOfWork fieldOfWork;
        uint proposalDeadline;
        bool finished;
        bool proposalPassed;
        uint passedPercent;
        bytes32 proposalHash;
        uint dividend;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    struct Vote {
        bool inSupport;
        address voter;
    }

    event NumberLogger(string description, uint number);
    event AddressLogger(string description, address addr);
    event ProposalFinishedLogger(uint proposalId, uint totalVotes, uint approve, uint disapprove);
    event NewProposalCreated(uint proposalID);
    event Voted(uint proposalID, bool position, address voter);

    //constructor
    function ProposalToken() public payable {
        debatingPeriodInMinutes = 10;  // TODO Move to settings
    }

    /* function getDividend() public constant returns (uint dividend) {
      return this.dividend;
    } */

    function getFieldOfWork() public constant returns (FieldOfWork) {
        return fow;
    }

    function setFieldOfWork(uint _value) public {
        //require(uint(FieldOfWork.Partnership) >= _value);
        fow = FieldOfWork(_value);
    }

    function getProposal(uint proposalID) public constant returns (address recipient,
    uint amount,
    string description,
    uint proposalDeadline,
    bool finished,
    bool proposalPassed,
    uint passedPercent, uint dividend) {
        Proposal storage proposal = proposals[proposalID];
        return (proposal.recipient, proposal.amount, proposal.description, proposal.proposalDeadline, proposal.finished, proposal
        .proposalPassed, proposal.passedPercent, proposal.dividend);
    }

    function getNumProposals() public constant returns (
        uint numOfProposals) {
        return proposals.length;
    }

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

    function isIcoFinished() returns (bool icoFinished);
    function currentTime() returns (uint time);
    function isShareholder(address userAddress) returns (bool shareholder);
    function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork) returns (uint influence);

    function newProposal(
        string name,
        string description,
        address beneficiary,
        uint weiAmount,
        FieldOfWork fieldOfWork) public votingAllowed
        onlyShareholders
    returns (uint proposalID)
    {
        AddressLogger("BENEFICIARY", beneficiary);
        proposalID = proposals.length++;
        Proposal storage proposal = proposals[proposalID];
        proposal.recipient = beneficiary;
        proposal.name = name;
        proposal.description = description;
        proposal.amount = weiAmount;
        proposal.proposalHash = sha3(beneficiary, weiAmount); // TODO add transactionBytecode
        proposal.proposalDeadline = currentTime() + debatingPeriodInMinutes * 1 minutes;
        proposal.finished = false;
        proposal.fieldOfWork = fieldOfWork;
        proposal.proposalPassed = false;
        proposal.dividend = 0;
        numProposals = proposalID;
        NewProposalCreated(proposalID);
        return proposalID;
    }

    function vote(
        uint proposalNumber,
        bool supportsProposal
    ) public votingAllowed
    onlyShareholders
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
        // proposals[0] or proposals[proposalNumber] ???
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
