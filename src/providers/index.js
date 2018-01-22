import web3 from 'utils/web3';

let notifyUser;
let app;
async function init(_notifyUser, _app) {
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
    // 1 - 10 is main net etc.
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
