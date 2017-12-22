pragma solidity ^0.4.8;

contract VotingToken {

    uint public debatingPeriodInMinutes;

    Voting[] public votings;

    uint public numVotings;

    enum FieldOfWork { Finance, Organisational, Product, Partnership }

    FieldOfWork public fow = FieldOfWork.Finance;

    event Voted(uint votingID, bool position, address voter);
    event VotingTallied(uint votingID, uint result, uint quorum, bool active);

    struct Voting {
        address recipient;
        uint amount;
        string description;
        FieldOfWork fieldOfWork;
        uint votingDeadline;
        bool finished;
        bool votingPassed;
        bytes32 votingHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    //constructor
    function VotingToken() public payable {
        debatingPeriodInMinutes = 10;  // TODO Move to settings
    }

    function getFieldOfWork() public constant returns (FieldOfWork) {
        return fow;
    }

    function setFieldOfWork(uint _value) public {
        //require(uint(FieldOfWork.Partnership) >= _value);
        fow = FieldOfWork(_value);
    }

    function getVoting(uint votingID) public constant returns (address recipient,
    uint amount,
    string description,
    uint votingDeadline,
    bool finished,
    bool votingPassed,
    uint passedPercent){
        Voting storage voting = votings[votingID];
        uint passedPercentRes = 0;

        return (voting.recipient, voting.amount, voting.description, voting.votingDeadline, voting.finished, voting
        .votingPassed, passedPercentRes);
    }

    function getNumVotings() public constant returns (
        uint numVotings) {
        return votings.length;
    }

    struct Vote {
        bool inSupport;
        address voter;
    }

    // Modifier that allows only shareholders to vote and create new votings
    modifier onlyShareholders {
        isShareholder(msg.sender);
        _;
    }

    function currentTime() returns (uint time);
    function isShareholder(address userAddress) returns (bool shareholder);
    function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork) returns (uint influence);

    function newVoting(
        address beneficiary,
        uint weiAmount)
    onlyShareholders
    returns (uint votingID)
    {
        votingID = votings.length++;
        votings.length++;
        Voting storage voting = votings[votingID];
        voting.recipient = beneficiary;
        voting.amount = weiAmount;
        voting.votingHash = sha3(beneficiary, weiAmount); // TODO add transactionBytecode
        voting.votingDeadline = currentTime() + debatingPeriodInMinutes * 1 minutes;
        voting.finished = false;
        voting.votingPassed = false;
        numVotings = votingID+1;

        return votingID;
    }

    function vote(
        uint votingNumber,
        bool supportsVoting
    )
    onlyShareholders
    returns (uint voteID)
    {
        Voting storage voting = votings[votingNumber];
        require(voting.voted[msg.sender] != true);

        voteID = voting.votes.length++;
        voting.votes[voteID] = Vote({inSupport: supportsVoting, voter: msg.sender});
        voting.voted[msg.sender] = true;
        Voted(votingNumber, supportsVoting, msg.sender);
        return voteID;
    }

    function executeVoting(uint votingNumber) public
    {
        Voting storage voting = votings[votingNumber];

        require(currentTime() > voting.votingDeadline                                             // If it is past the voting deadline
            && !voting.finished                                                          // and it has not already been finished
            && voting.votingHash == sha3(voting.recipient, voting.amount)); // and the supplied code matches the voting...


        uint approve = 0;
        uint disapprove = 0;

        for (uint i = 0; i < voting.votes.length; ++i) {
            Vote storage v = voting.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, voting.fieldOfWork);
            if (v.inSupport) {
                approve += voteWeight;
            } else {
                disapprove += voteWeight;
            }
        }

        voting.finished = true;

        if (approve > disapprove) {
            // Voting passed; execute the transaction
            voting.votingPassed = true;
        } else {
            // Voting failed
            voting.votingPassed = false;
        }
    }
}