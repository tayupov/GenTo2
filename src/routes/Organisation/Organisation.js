import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { loadOrganization } from 'provider/DAOProvider';
import downloadString from 'provider/IPFSDownloadProvider';

import ICO from './components/ICO';
import DAO from './components/DAO';

export default class Organisation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      auctionDetails: {
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
      }
    }
  }

  async componentDidMount() {
    const organisation = await loadOrganization(this.props.address, true)
    this.setState({ auctionDetails: { ...organisation } })

    // const description = await downloadString(this.state.descriptionHash)
    // this.setState({ description })
  }

  async componentWillReceiveProps(nextProps) {
    const organisation = await loadOrganization(this.props.address, true)
    this.setState({ auctionDetails: { ...organisation } })

    // const description = await downloadString(this.state.descriptionHash)
    // this.setState({ description })
  }

  render() {
    const address = this.props.address;

    return (
      <div>
        <Button as={Link} to={{ pathname: `/dao/${address}/proposals` }} content="Proposals" />
        {!this.state.isICOFinished  && <ICO {...this.state} {...this.props} />}
        {/* {!this.state.isICOFinished && <DAO {...this.state} {...this.props} />} */}
      </div>
    )
  }
}
