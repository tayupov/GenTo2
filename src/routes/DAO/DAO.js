import React from 'react';

export default class DAO extends React.Component {
  render() {
    const address = this.props.address;
    return (
      <div>
        Add info to this page! Address: {address}
      </div>
    )
  }
}
