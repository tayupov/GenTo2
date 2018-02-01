import React from 'react';
import { Grid, Segment, Header, List, Image, Input, Form, Button, Table, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { loadOrganization } from 'provider/DAOProvider';
import { loadAllProposals } from 'provider/ProposalListProvider'
import downloadString from 'provider/IPFSDownloadProvider';
import fieldsOfWork from 'constants/fieldsOfWork'

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
      descriptionHash: null,
      delegate: null,
      proposals: []
    }
  }

  async loadOrganizationData(address) {
    const DAO = await loadOrganization(address, true)
    this.setState({ ...DAO })

    loadAllProposals(address)
      .then(proposals => this.setState({ proposals }))

    downloadString(this.state.descriptionHash)
      .then(description => this.setState({ description }))
  }

  async componentDidMount() {
    this.loadOrganizationData(this.props.address)
  }

  async componentWillReceiveProps(nextProps) {
    this.loadOrganizationData(nextProps.address)
  }

  async delegate(e, data) {
    const address = data.value
    if (web3.isAddress(address)) {
      const from = this.props.account
      const res = await this.state.delegate.sendTransaction(data.fieldofwork, address, { from })
    }
  }

  async claimDividend(e) {
    const from = this.props.account
    const res = await this.state.claimDividend()
  }

  async claimVotingReward(e) {
    const from = this.props.account
    const res = await this.state.claimDecisionMakerReward.sendTransaction({from})
  }

  render() {
    const address = this.props.address;
    const proposals = this.state.proposals

    return (
      <div>
        <Header as="h1">{this.state.name}</Header>
        <Segment loading>
          <Image src="https://react.semantic-ui.com/assets/images/wireframe/paragraph.png" />
        </Segment>

        <Grid>
          <Grid.Row>
            {/* TODO: Move this to a seperate file*/}
            <Grid.Column width='3'>
              <List selection>
                <Header><u>Proposals</u></Header>
                {proposals.length > 0 &&
                  proposals.slice(0, 6).map((proposal, index) =>
                    <List.Item
                      key={index}
                      as={Link}
                      to={{ pathname: `/dao/${address}/proposals/${proposal.proposalNumber}` }}
                    >
                      <List.Header>{proposal.name}</List.Header>
                    </List.Item>
                  )
                }
                {proposals.length >= 6 &&
                  <List.Item as={Link} to={{ pathname: `/dao/${address}/proposals` }}>More...</List.Item>
                }
              </List>
            </Grid.Column>

            <Grid.Column width='13'>

              {/*TODO: Move this to a seperate file*/}
              <Table basic='very'>

                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Delegatee Address</Table.HeaderCell>
                    <Table.HeaderCell>Field Of Work</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Input
                        fluid
                        placeholder={`0xe42c3D57eD0827f866AA773c6BeDec49b0EEaa3e`}
                        fieldofwork='1'
                        onChange={(e, data) => this.delegate(e, data)}
                      />
                    </Table.Cell>
                    <Table.Cell>Organisational</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Input
                        fluid
                        placeholder={`0xe42c3D57eD0827f866AA773c6BeDec49b0EEaa3e`}
                        fieldofwork='2'
                        onChange={(e, data) => this.delegate(e, data)}
                      />
                    </Table.Cell>
                    <Table.Cell>Product</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Input
                        fluid
                        placeholder={`0xe42c3D57eD0827f866AA773c6BeDec49b0EEaa3e`}
                        fieldofwork='3'
                        onChange={(e, data) => this.delegate(e, data)}
                      />
                    </Table.Cell>
                    <Table.Cell>Finance</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Input
                        fluid
                        placeholder={`0xe42c3D57eD0827f866AA773c6BeDec49b0EEaa3e`}
                        fieldofwork='4'
                        onChange={(e, data) => this.delegate(e, data)}
                      />
                    </Table.Cell>
                    <Table.Cell>Marketing</Table.Cell>
                  </Table.Row>
                </Table.Body>

              </Table>

            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width='2'>
              <Form>
                <Form.Field>Dividend payout: 0</Form.Field>
                <Button type='submit' onClick={this.claimDividend}>Claim</Button>
              </Form>
            </Grid.Column>

            <Grid.Column width='2'>
              <Form>
                <Form.Field>Voting Reward: 0</Form.Field>
                <Button type='submit' onClick={this.claimVotingReward}>Claim</Button>
              </Form>
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </div>
    )
  }
}
