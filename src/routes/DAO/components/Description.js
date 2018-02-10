import React from 'react'
import { Segment, Divider } from 'semantic-ui-react'

export default class Description extends React.Component {
  render() {
    return (
      <Segment>
        {this.props.description || <div className='skeleton'></div>}
        <Divider />
        <p id='ipfs-disclaimer'>Offchained to IPFS</p>
      </Segment>
    )
  }
}