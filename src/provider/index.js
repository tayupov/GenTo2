import web3 from 'utils/web3';
import DAOListProvider from 'provider/DAOListProvider'

import GentoDaoFactoryArtifact from 'assets/contracts/GentoDaoFactory'
import { default as contract } from 'truffle-contract'



const GentoDaoFactory = contract(GentoDaoFactoryArtifact)
let notifyUser;
let app;
async function init(_notifyUser, _app) {
  console.log("provider start!")
  notifyUser = _notifyUser
  app = _app

  //this is connected to util/web3, we should do this nicer
  if (!window.web3) {
    notifyUser('Your Browser is not Web3 enabled. Use MetaMask or Mist', 'error')
  } else {
    notifyUser('Connect to Web3', 'success')
  }
  await updateNetwork()
  await initAccount()
  console.log("connected account!")
  console.log(GentoDaoFactory)

/*  GentoDaoFactory.setProvider(web3.currentProvider);
  const instance = await GentoDaoFactory.deployed()
/*  await instance.createContract.sendTransaction(1000000000, "YAY", "Fucking Awesome Coin", 10, 100, 10, new Date().getTime() + 5000, new Date().getTime() + 10000, {
    from: app.state.account
  })
  console.log(await instance.getICOs.call())

  console.log(instance)*/
  DAOListProvider(app)
}


const initAccount = async () => {
  await updateAccount()
  setInterval(updateAccount, 1000);
}

const updateAccount = async () => {
  try {
    const accounts = await promisify(cb => web3.eth.getAccounts(cb))
    if (app.state.account !== accounts[0]) {
      //if set, account was switched
      if (app.state.account) {
        notifyUser('Account Switched!', 'info');
      } else {
        notifyUser('Account Opened!', 'info');
      }

      app.setState({
        account: accounts[0]
      })
    }
  } catch (e) {
    console.error(e)
    notifyUser('Account not updated', 'error');
  }
}

const updateNetwork = async () => {
  try {
    const netId = await promisify(cb => web3.version.getNetwork(cb))
    if (+netId < 10) {
      notifyUser("ILLEGAL NETWORK: Please switch to 'local network' in MetaMask and reload the page", "error")
    }
    app.setState({
      network: netId
    })
  } catch (e) {
    console.error(e)
    notifyUser('Network not found', 'error')
  }
}

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err)
      }

      resolve(res);
    })
  );
export default init;
