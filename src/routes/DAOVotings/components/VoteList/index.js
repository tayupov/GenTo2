import React from 'react';

import VotingCard from 'components/VotingCard';

const PollList = ({
    onClick, handleOpen, handleReset, polls, account
}) => (
    polls.map(poll => (
        <VotingCard
            header={poll.header}
            voterAddresses={poll.voterAddresses}
            pollState={poll.state}
            pollCategory={poll.category}
            pollDescription={poll.description}
            pollDate={poll.endDate}
            pollPayout={poll.payout}
            onClick={onClick}
            handleOpen={handleOpen}
            handleReset={handleReset}
            account={account}
        />
    ))
)

export default PollList;