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
        uint passedPercent;
        bytes32 votingHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    event NumberLogger(string description, uint number);
    event AddressLogger(string description, address addr);
    event VotingFinishedLogger(string description, bool finished);

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
    uint passedPercent) {
        Voting storage voting = votings[votingID];
        return (voting.recipient, voting.amount, voting.description, voting.votingDeadline, voting.finished, voting
        .votingPassed, voting.passedPercent);
    }

    function getNumVotings() public constant returns (
        uint numOfVotings) {
        return votings.length;
    }

    struct Vote {
        bool inSupport;
        address voter;
    }

    // Modifier that allows only shareholders to vote and create new votings
    modifier onlyShareholders {
        //if (!isShareholder(msg.sender)) throw;
        require(isShareholder(msg.sender));
        _;
    }

    function currentTime() returns (uint time);
    function isShareholder(address userAddress) returns (bool shareholder);
    function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork) returns (uint influence);

    function newVoting(
        address beneficiary,
        uint weiAmount,
        FieldOfWork fieldOfWork) public
        onlyShareholders
    returns (uint votingID)
    {
        AddressLogger("BENEFICIARY", beneficiary);
        votingID = votings.length++;
        Voting storage voting = votings[votingID];
        voting.recipient = beneficiary;
        voting.amount = weiAmount;
        voting.votingHash = sha3(beneficiary, weiAmount); // TODO add transactionBytecode
        voting.votingDeadline = currentTime() + debatingPeriodInMinutes * 1 minutes;
        voting.finished = false;
        voting.fieldOfWork = fieldOfWork;
        voting.votingPassed = false;
        numVotings = votingID;
        return votingID;
    }

    function vote(
        uint votingNumber,
        bool supportsVoting
    ) public
    onlyShareholders
    returns (uint voteID)
    {
        NumberLogger("VotingNum: ", votingNumber);
        Voting storage voting = votings[votingNumber];
        require(voting.voted[msg.sender] != true);

        voteID = voting.votes.length++;
        voting.votes[voteID] = Vote({inSupport: supportsVoting, voter: msg.sender});
        voting.voted[msg.sender] = true;
        Voted(votingNumber, supportsVoting, msg.sender);
        return voteID;
    }

    function executeVoting(uint votingNumber)
    {

        // votings[0] or votings[votingNumber] ???
        Voting storage voting = votings[votingNumber];





        require(currentTime() > voting.votingDeadline                       // If it is past the voting deadline
            && !voting.finished);                                             // and it has not already been finished
            // && voting.votingHash == sha3(voting.recipient, voting.amount)); // and the supplied code matches

        uint approve = 0;
        uint disapprove = 0;

        for (uint i = 0; i < voting.votes.length; ++i) {
            Vote storage v = voting.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, voting.fieldOfWork);
            NumberLogger("voteWeight", voteWeight);
            VotingFinishedLogger("v.inSupport", v.inSupport);
            if (v.inSupport) {
                approve += voteWeight;
            } else {
                disapprove += voteWeight;
            }
        }

        NumberLogger("approve", approve);
        NumberLogger("disapprove", disapprove);

        voting.finished = true;

        if (approve >= disapprove) {
            // Voting passed; execute the transaction
            voting.votingPassed = true;
        } else {
            // Voting failed
            voting.votingPassed = false;
        }
        voting.passedPercent = approve * 100 / (approve+disapprove); 
    }
}
