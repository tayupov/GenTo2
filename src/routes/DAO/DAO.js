import React from 'react';
import { Grid, Segment, Header, Image, Input, Select, Button, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { loadOrganization } from 'provider/DAOProvider';
import { loadAllProposals } from 'provider/ProposalListProvider'
import downloadString from 'provider/IPFSDownloadProvider';
import fieldsOfWork from 'constants/fieldsOfWork'

export default class DAO extends React.Component {

  constructor(props) {
    super(props)
    this.delegate = this.delegate.bind(this)    
    this.state = {
      loading: false,
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

  async componentDidMount() {
    const DAO = await loadOrganization(this.props.address, true)
    this.setState({ ...DAO })

    const proposals = loadAllProposals(this.props.address)
    .then(proposals => this.setState({ proposals }) )

    const description = downloadString(this.state.descriptionHash)
    .then(description => this.setState({ description }) )
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({ loading: true })
    const DAO = await loadOrganization(nextProps.address, true)
    this.setState({ ...DAO })
  }

  async delegate(event, element) {
    const delegatePower = this.state.delegate

    const delegateeElement = document.getElementById('delegatee-input')
    const delegatee = delegateeElement.value
    const fow = this.state.fieldOfWorkValue

    const res = await delegatePower(fow, delegatee)
  }

  render() {
    const address = this.props.address;
    return (
      <div>
        <Header as="h1">{this.state.name}</Header>
        <Segment loading>
          <Image src="https://react.semantic-ui.com/assets/images/wireframe/paragraph.png" />
        </Segment>


        <Grid columns='three'>
          <Grid.Row>
            <Grid.Column as={Link} to={{ pathname: `/dao/${address}/proposals` }} content="Proposals">
              <Segment>
                <Header as='h5'>Proposals</Header>
                <Image src="https://react.semantic-ui.com/assets/images/wireframe/paragraph.png" />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider hidden />

        <Input fluid type='text' placeholder='Address...' action id="delegatee-input">
          <input />
          <Select
            options={fieldsOfWork}
            defaultValue={1}
            onChange={(e, data) => this.setState({ fieldOfWorkValue: data.value })}
          />
          <Button onClick={this.delegate}>Delegate</Button>
        </Input>

      </div>
    )
  }
}
