import React from 'react'
import { Table, Button } from 'semantic-ui-react'

export default class Claiming extends React.Component {
  render() {
    const { claimDividend, claimVotingReward} = this.props
    const { dividendForAccount, votingRewardForAccount } = this.props

    const canClaimDividend = dividendForAccount !== 0
    const canClaimVotingReward = votingRewardForAccount !== 0
    return (
      <Table basic='very' celled={false} collapsing>
        <Table.Body>

          <Table.Row>
            <Table.Cell>
              <Button disabled={!canClaimDividend} onClick={claimDividend}>
                Dividend: 
                <br />
                {dividendForAccount} Ether
              </Button>
            </Table.Cell>
            <Table.Cell>
              <Button disabled={!canClaimVotingReward}  onClick={claimVotingReward}>
                Voting Reward:
                <br />
                {votingRewardForAccount} Ether
              </Button>
            </Table.Cell>
          </Table.Row>

        </Table.Body>
      </Table>
    )
  }
}
