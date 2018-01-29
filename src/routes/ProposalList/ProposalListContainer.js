import React from 'react';
import ProposalList from './ProposalList';
import { loadAllProposals, filterExecuted, filterActive } from 'provider/ProposalListProvider'

export default class ProposalListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      proposals: [],
      activeProposals: [],
      executedProposals: []
    }
  }

  async componentDidMount() {
    const proposals = await loadAllProposals(this.props.address)
    const activeProposals = await filterActive(proposals)
    const executedProposals = await filterExecuted(proposals)
    this.setState({proposals});
    this.setState({activeProposals});
    this.setState({executedProposals});
    this.state.loaded = true;
  }
  render() {

    return (
      <ProposalList
          proposals={this.state.proposals}
          activeProposals={this.state.activeProposals}
          executedProposals={this.state.executedProposals}
      />
    );
  }
}
