import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { loadOrganization } from 'provider/DAOProvider';
import downloadString from 'provider/IPFSDownloadProvider';

import ICO from 'components/ICO';
import DAO from 'components/DAO';

export default class Organisation extends React.Component {

  async componentDidMount() {
    const organisation = await loadOrganization(this.props.address)
    this.setState({ organisation })

    const icoFinished = await organisation.isIcoFinished()

    const descriptionHash = await DAO.descriptionHash.call()
    const description = await downloadString(descriptionHash)
    this.setState({ description })
  }

  render() {
    const address = this.props.address;

    return (
      <div>
        <Button as={Link} to={{ pathname: `/dao/${address}/proposals` }} content="Proposals" />
        {this.icoFinished  && <ICO ico={this.state.organisation} {...this.props} />}
        {!this.icoFinished && <DAO dao={this.state.organisation} {...this.props} />}
      </div>
    )
  }
}
