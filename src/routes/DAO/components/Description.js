import React from 'react'
import { Segment, Divider } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'

export default class Description extends React.Component {
  render() {
    return (
      <Segment>
          <p><ReactMarkdown source={this.props.description} /></p>
        <Divider />
        <p id='ipfs-disclaimer'>Offchained to IPFS</p>
      </Segment>
    )
  }
}