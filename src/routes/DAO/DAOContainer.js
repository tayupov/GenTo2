import React from 'react';
import { loadOrganization } from 'provider/DAOProvider';

import DAO from './DAO';
import ICO from './IcoContainer';

export default class DAOContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isICOFinished: null
    }
  }

  async componentDidMount() {
    const DAO = await loadOrganization(this.props.address, this.props.account, true)
    this.setState({ isICOFinished: DAO.isICOFinished })
  }
  render() {
    const isICOFinished =  (this.state.isICOFinished === true)
    return (
      <div>
        {!isICOFinished  && <ICO {...this.props} />}
        {isICOFinished && <DAO {...this.props} />}
      </div>
    )
  }
}
