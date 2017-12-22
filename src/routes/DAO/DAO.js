import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class DAO extends React.Component {
  render() {
    const address = this.props.address;
    return (
      <div>
        <Button as={Link} to={{ pathname: `/dao/${address}/votings` }} content="Votings" />
        <Button as={Link} to={{ pathname: `/dao/${address}/settings` }} content="Settings" />
      </div>
    )
  }
}
