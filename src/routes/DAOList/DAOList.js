import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';

import { loadAllOrganizations } from 'providers/DAOListProvider'

import Home from 'routes/Home'

export default class DAOList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      gentoOrganizations: []
    }
  }

  render() {
    const { isLoggedIn, gentoOrganizations } = this.props
    return (
      <div>
        {!isLoggedIn && <Home />}

        {isLoggedIn &&
          <Card.Group>
            {gentoOrganizations.map((org, index) => {
              return (
                <Card as={Link} to={{ pathname: `/dao/${org.address}` }} key={index}>
                  <Image src="https://i.imgur.com/NSwmqep.jpg" />
                  <Card.Content>
                    <Card.Header>
                      {org.name}
                    </Card.Header>
                    <Card.Description>
                      {org.description}
                    </Card.Description>
                  </Card.Content>
                </Card>
              )
            })}
          </Card.Group>
        }

      </div>
    )
  }
}
