import React from 'react';
import { Container, Divider } from 'semantic-ui-react';

export default () => (
  <div>
    <Container text>
      <h1>About GenTo</h1>
      <Divider section hidden />
      <p>
        GenTo is a platform that facilitates creating Decentralized Autonomous
        Organizations (DAOs). It creates user-defined Smart Contracts and
        automatically deploys them to the blockchain. The platform allows
        running an Initial Coin Offering for a DAO and implements basic
        governance mechanisms, that enable token holders to decide over the
        usage of the organizsation's funds. The application assets are deployed
        to the InterPlanetary File System. All of this without the need to write
        a single line of code!
      </p>
      <p>
        With the governance mechanisms we make investing in Initial Coin
        Offerings safer for investors. Hiding technical details from the user,
        we make creating Decentralized Autonomous Organizations accessible for a
        broader, non-technical audience. GenTo provides an intuitive web-based
        UI that guides the user through the contract creation process step by
        step..
      </p>
      <p>
        GenTo2 has been developed by a student group at the chair for
        Information Systems Engineering at Technical University of Berlin in
        collaboration with venture capitalist and startup advisor Globumbus.
      </p>
    </Container>
  </div>
);
