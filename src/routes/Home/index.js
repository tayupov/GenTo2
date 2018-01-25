import React from 'react';
import { Container, Divider } from 'semantic-ui-react';

export default () => (
  <div>
    <Container text>
      <h1>About GenTo</h1>
      <Divider section hidden />
      <p>
        GenTo is a platform that facilitates Initial Coin Offerings and creation/governance of DAOs.
        It creates user-defined
        Smart Contracts and automatically deploys them to the blockchain - without the need
        to write a single line of code!
      </p>
      <p>
        Hiding technical details from the user, we make DAOs accessible for
        a broader, non-technical audience. GenTo provides an intuitive web-based UI that
        guides the user through the contract creation process step by step.
      </p>
      <p>
          GenTo2 has been developed by a student group at the chair for Information Systems
          Engineering at Technical University of Berlin in collaboration with venture
          capitalist and startup advisor Globumbus.
      </p>
    </Container>
  </div>
)
