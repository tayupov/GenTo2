pragma solidity ^0.4.8;

contract VotingToken {


    uint public debatingPeriodInMinutes;
    Voting[] public votings;
    uint public numVotings;
    enum FieldOfWork { Finance, Organisational, Product, Partnership }

    event Voted(uint votingID, bool position, address voter);
    event VotingTallied(uint votingID, uint result, uint quorum, bool active);

    struct Voting {
        address recipient;
        uint amount;
        string description;
        FieldOfWork fieldOfWork;
        uint votingDeadline;
        bool executed;
        bool votingPassed;
        bytes32 votingHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    function getVoting(uint votingID) constant returns (address recipient,
    uint amount,
    string description,
    uint votingDeadline,
    bool executed,
    bool votingPassed){
        Voting voting = votings[votingID];
        return (voting.recipient, voting.amount, voting.description, voting.votingDeadline, voting.executed, voting
        .votingPassed);
    }

    function getNumVotings() constant returns (
        uint numVotings){
        return votings.length;
    }

    struct Vote {
        bool inSupport;
        address voter;
    }

    // Modifier that allows only shareholders to vote and create new votings
    modifier onlyShareholders {
        // TODO: Check if msg.sender holds tokens
        //require(sharesTokenAddress.balanceOf(msg.sender) > 0);
        _;
    }

    function currentTime() returns (uint time);

    /**
     * Constructor function
     *
     * First time setup
     */
    function VotingToken() payable {
        // sharesTokenAddress = Token(sharesAddress);
        debatingPeriodInMinutes = 10; // TODO Move to settings
    }

    /**
     * Add Voting
     *
     * Propose to send `weiAmount / 1e18` ether to `beneficiary` for `jobDescription`. `transactionBytecode ? Contains : Does not contain` code.
     *
     * @param beneficiary who to send the ether to
     * @param weiAmount amount of ether to send, in wei
     */
    function newVoting(
        address beneficiary,
        uint weiAmount
    )
    onlyShareholders
    returns (uint votingID)
    {
        votingID = votings.length++;
        Voting storage voting = votings[votingID];
        voting.recipient = beneficiary;
        voting.amount = weiAmount;
        voting.votingHash = sha3(beneficiary, weiAmount); // TODO add transactionBytecode
        voting.votingDeadline = currentTime() + debatingPeriodInMinutes * 1 minutes;
        voting.executed = false;
        voting.votingPassed = false;
        numVotings = votingID+1;

        return votingID;
    }

    /**
     * Log a vote for a voting
     *
     * Vote `supportsVoting? in support of : against` voting #`votingNumber`
     *
     * @param votingNumber number of voting
     * @param supportsVoting either in favor or against it
     */
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

    function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork)
    returns (uint influence)
    {
        return 1; // TODO Influence from Delegation
    }


    function executeVoting(uint votingNumber)
    {
        Voting storage voting = votings[votingNumber];

        require(currentTime() > voting.votingDeadline                                             // If it is past the voting deadline
        && !voting.executed                                                          // and it has not already been executed
        && voting.votingHash == sha3(voting.recipient, voting.amount)); // and the supplied code matches the voting...


        // ...then tally the results
        uint quorum = 0;
        uint yea = 0;
        uint nay = 0;

        for (uint i = 0; i < voting.votes.length; ++i) {
            Vote storage v = voting.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, voting.fieldOfWork);
            quorum += voteWeight;
            if (v.inSupport) {
                yea += voteWeight;
            } else {
                nay += voteWeight;
            }
        }

        voting.executed = true;

        if (yea > nay ) {
            // Voting passed; execute the transaction

           // require(voting.recipient.call.value(voting.amount)(transactionBytecode));

            voting.votingPassed = true;
        } else {
            // Voting failed
            voting.votingPassed = false;
        }
    }
}
