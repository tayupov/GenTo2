
import GentoDaoFactoryArtifact from 'assets/contracts/GentoDaoFactory'
import GentoDaoArtifact from 'assets/contracts/GentoDao'

import { default as contract } from 'truffle-contract'
import web3 from 'utils/web3';

const GentoDaoFactoryContract = contract(GentoDaoFactoryArtifact)
const GentoDaoContract = contract(GentoDaoArtifact)
let DaoFactoryInstance;

let app

const init = async (_app) => {
    GentoDaoFactoryContract.setProvider(web3.currentProvider);
    GentoDaoContract.setProvider(web3.currentProvider);
    DaoFactoryInstance = await GentoDaoFactoryContract.deployed()
    app = _app

    const organizations = await Promise.all((await DaoFactoryInstance.getICOs.call()).map(address => loadOrganization(address)))
    console.log(organizations)
    app.setState({
      organizations: organizations
    })
}

const loadOrganization = async(address) => {
  const dao = await GentoDaoContract.at(address)
  return {
    name: await dao.name.call(),
    address: address
  }
}

export default init;
