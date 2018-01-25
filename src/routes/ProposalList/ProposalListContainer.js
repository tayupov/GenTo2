import React from 'react';
import ProposalList from './ProposalList';
import { loadAllProposals } from 'provider/ProposalListProvider'

export default class ProposalListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      proposals: []
    }
  }

  async componentDidMount() {
    const proposals = await loadAllProposals(this.props.address)
    this.setState({proposals});
    this.state.loaded = true;
  }
  render() {
    return (
      <ProposalList proposals={this.state.proposals} />
    );
  }
}
