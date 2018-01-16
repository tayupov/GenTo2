import React from 'react';

import ProposalCard from 'components/ProposalCard';

const PollList = ({
    onClick, handleOpen, handleReset, polls, account
}) => (
    polls.map(poll => (
        <ProposalCard
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