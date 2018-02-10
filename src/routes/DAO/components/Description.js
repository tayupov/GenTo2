import React from 'react'
import { Segment, Divider } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'

export default class Description extends React.Component {
  render() {
    const description = this.props.description
    return (
      <Segment>
          {!description && <div className="skeleton"></div>}
          {description && <p><ReactMarkdown source={this.props.description} className="description"/></p>}
        <Divider />
        <p id='ipfs-disclaimer'>Offchained to IPFS</p>
      </Segment>
    )
  }
}
