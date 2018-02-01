import web3 from 'utils/web3';
import promisify from 'utils/promisify'

let notifyUser;
let app;

async function web3Connect(_notifyUser, _app) {
  notifyUser = _notifyUser
  app = _app

  if (!window.web3) {
    notifyUser('Your Browser is not Web3 enabled. Use MetaMask or Mist', 'error')
    return;
  }

  await updateNetwork()
  await initAccount()
}


const initAccount = async () => {
  await updateAccount()
  setInterval(updateAccount, 1000);
}

const updateAccount = async () => {
  try {
    const accounts = await promisify(cb => web3.eth.getAccounts(cb))
    if (app.state.account !== accounts[0]) {
      if (app.state.account) {
        notifyUser('Account Switched!', 'info');
      } else {
        notifyUser('Account Opened!', 'info');
      }
      app.setState({ account: accounts[0] })
    }
  } catch (e) {
    console.error(e)
    notifyUser('Account not updated', 'error');
  }
}

const updateNetwork = async () => {
  try {
    const netId = await promisify(cb => web3.version.getNetwork(cb))
    app.setState({ network: netId })
  } catch (e) {
    console.error(e)
    notifyUser('Network not found', 'error')
  }
}

export default web3Connect;
