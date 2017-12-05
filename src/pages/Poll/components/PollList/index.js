import React from 'react';

import VotingCard from 'components/VotingCard';

const PollList = ({
    onClick, handleOpen, polls
}) => (
    polls.map(poll => (
        <VotingCard
            header={poll.header}
            onClick={onClick}
            handleOpen={handleOpen}
        />
    ))
)

export default PollList;