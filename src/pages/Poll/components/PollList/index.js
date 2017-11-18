import React from 'react';

import GenericCard from 'components/GenericCard';

const PollList = ({
    onClick, polls
}) => (
    polls.map(poll => (
        <GenericCard
            header={poll.header}
            onClick={onClick}
        />
    ))
)

export default PollList;