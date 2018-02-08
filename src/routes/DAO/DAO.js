import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Header, Image, Form, Button } from 'semantic-ui-react';
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
      delegations: [],
      proposals: []
    }
  }

  async loadOrganizationData(address, account) {
    const DAO = await loadOrganization(address, account, true)
    this.setState({ ...DAO })

    loadAllProposals(address)
      .then(proposals => this.setState({ proposals }))

    downloadString(this.state.descriptionHash)
      .then(description => this.setState({ description }))
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
        this.props.notify('Successfully delegated', 'success')
      }
    }
  }

  async claimDividend(e) {
    const from = this.props.account
    const res = await this.state.claimDividend.sendTransaction({ from })
  }

  async claimVotingReward(e) {
    const from = this.props.account
    const res = await this.state.claimDecisionMakerReward.sendTransaction({ from })
  }

  render() {
    return (
      <div>
        <Header as="h1">{this.state.name}</Header>
        <Grid>

          <Grid.Row>

            <Grid.Column width='12'>
              <Segment>
                {this.state.description || <div className='skeleton'></div>}
              </Segment>
            </Grid.Column>

            <Grid.Column width='4'>
              <Button type='submit' onClick={this.claimDividend}>Dividend: 0</Button>
              <Button type='submit' onClick={this.claimVotingReward}>Voting Reward: 0</Button>
            </Grid.Column>

          </Grid.Row>

          <Grid.Row>

            <Grid.Column width='3'>
              <ProposalsCompact address={this.state.address} proposals={this.state.proposals} />
            </Grid.Column>

            <Grid.Column width='9'>
              <Delegation delegate={this.delegate} delegations={this.state.delegations} />
            </Grid.Column>

          </Grid.Row>

        </Grid>
      </div>
    )
  }
}
