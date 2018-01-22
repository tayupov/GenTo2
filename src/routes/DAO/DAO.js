import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { loadOrganization } from 'provider/DAOProvider';
import loadStringFromIPFS from 'provider/IPFSDownloadProvider';

import DetailsSection from './components/DetailsSection';
import TokenSection from './components/TokenSection';

export default class DAO extends React.Component {

  async componentDidMount() {
    const DAO = await loadOrganization(this.props.address)
    //set dao without description first, in case loading of description is delayed
    this.setState({ DAO })
    const descriptionHash = await DAO.descriptionHash.call()
    const description = await loadStringFromIPFS(descriptionHash)
    console.log(description)
    this.setState({ DAO, description })
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
