import React from 'react';

import VotingCard from 'components/VotingCard';

const PollList = ({
    onClick, handleOpen, polls, account
}) => (
    polls.map(poll => (
        <VotingCard
            header={poll.header}
            voterAddresses={poll.voterAddresses}
            onClick={onClick}
            handleOpen={handleOpen}
            account={account}
        />
    ))
)

export default PollList;