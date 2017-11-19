import React from 'react';

import GenericCard from 'components/GenericCard';

const PollList = ({
    onClick, handleOpen, polls
}) => (
    polls.map(poll => (
        <GenericCard
            header={poll.header}
            onClick={onClick}
            handleOpen={handleOpen}
        />
    ))
)

export default PollList;