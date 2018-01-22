import IPFS from 'ipfs';

export default getIPFS

let ipfs
async function getIPFS() {
  if (!ipfs) {
    ipfs = await initIPFS()
  }
  return ipfs
}

function initIPFS() {
  const ipfsNode = new IPFS();
  return new Promise((res, rej) => {
    ipfsNode.on('ready', async () => {
      res(ipfsNode)
    })
  })
}
