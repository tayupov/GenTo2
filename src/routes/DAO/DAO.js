import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

import Balances from './components/Balances'
import Claiming from './components/Claiming'
import Description from './components/Description'
import Delegation from './components/Delegation'
import ProposalsCompact from './components/ProposalsCompact'

import { loadOrganization } from 'provider/DAOProvider';
import { loadAllProposals } from 'provider/ProposalListProvider'
import downloadString from 'provider/IPFSDownloadProvider';

import web3 from 'utils/web3';

export default class DAO extends React.Component {
  constructor(props) {
    super(props)
    this.delegate = this.delegate.bind(this)
    this.claimDividend = this.claimDividend.bind(this)
    this.claimVotingReward = this.claimVotingReward.bind(this)
    this.loadOrganizationData = this.loadOrganizationData.bind(this)
    this.state = {
      address: null,
      name: null,
      symbol: null,
      saleStart: null,
      saleEnd: null,
      isICOFinished: null,
      numberOfProposals: null,
      numberOfShareholders: null,
      totalSupply: null,
      remainingTokensForICOPurchase: null,
      description: null,
      descriptionHash: null,
      delegate: null,
      delegationsForAccount: [],
      proposals: [],
      dividendForAccount: null,
      votingRewardForAccount: null,
      balanceForAccount: null,
      totalNumberOfTokens: null,
      balance: null
    }
  }

  async loadOrganizationData(address, account) {
    const DAO = await loadOrganization(address, account, true)
    this.setState({ ...DAO })

    loadAllProposals(address)
      .then(proposals => this.setState({ proposals }))

    this.setState({ description: null })
    downloadString(this.state.descriptionHash)
      .then(description => setTimeout(() => this.setState({ description }), 1500))
  }

  async componentDidMount() {
    this.loadOrganizationData(this.props.address, this.props.account)
  }

  async componentWillReceiveProps(nextProps) {
    this.loadOrganizationData(nextProps.address, this.props.account)
  }

  async delegate(e, data) {
    const delegatee = data.value
    const fieldofwork = data.fieldofwork
    if (web3.isAddress(delegatee)) {
      const from = this.props.account
      const res = await this.state.delegate.sendTransaction(fieldofwork, delegatee, { from })
      if (res) {
        // only demo purpose, use an event here
        this.props.notify('Successfully delegated', 'success')
      }
    }
  }

  async claimDividend(e) {
    const from = this.props.account
    await this.state.claimDividend.sendTransaction({ from })
  }

  async claimVotingReward(e) {
    const from = this.props.account
    await this.state.claimDecisionMakerReward.sendTransaction({ from })
  }

  render() {
    const { balanceForAccount, totalNumberOfTokens, balance } = this.state
    const { dividendForAccount, votingRewardForAccount } = this.state
    return (
      <div>
        <Header as="h1">{this.state.name}</Header>
        <Grid>

          <Grid.Row>
            <Grid.Column width='12'>
              <Description description={this.state.description} />
            </Grid.Column>

            <Grid.Column width='4'>
              <Balances balanceForAccount={balanceForAccount} totalNumberOfTokens={totalNumberOfTokens} balance={balance}/>
              <Claiming
                claimDividend={this.claimDividend}
                claimVotingReward={this.claimVotingReward}
                dividendForAccount={dividendForAccount}
                votingRewardForAccount={votingRewardForAccount}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width='3'>
              <ProposalsCompact address={this.state.address} proposals={this.state.proposals} />
            </Grid.Column>

            <Grid.Column width='9'>
              <Delegation
                account={this.props.account}
                delegate={this.delegate}
                delegationsForAccount={this.state.delegationsForAccount}
              />
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    )
  }
}