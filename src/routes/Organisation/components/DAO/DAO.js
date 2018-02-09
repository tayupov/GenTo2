import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { loadOrganization } from 'provider/DAOProvider';
import downloadString from 'provider/IPFSDownloadProvider';

import DetailsSection from './components/DetailsSection';
import TokenSection from './components/TokenSection';

export default class DAO extends React.Component {

  async componentDidMount() {
    const DAO = await loadOrganization(this.props.address)
    this.setState({ DAO })

    const descriptionHash = await DAO.descriptionHash.call()
    const saleEnd = await DAO.saleEnd.call();
    const timeSinceIcoEnded = Date.now() - saleEnd;
    const icoEnded = timeSinceIcoEnded > 0;
    const description = await downloadString(descriptionHash)
    this.setState({ description })
  }

  render() {
    const address = this.props.address;

    return (
      <div>
        <Button as={Link} to={{ pathname: `/dao/${address}/proposals` }} content="Proposals" />
        <DetailsSection />
        <TokenSection />
      </div>
    )
  }
}