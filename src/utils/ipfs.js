import IPFS from 'ipfs';

let ipfs

function initIPFS() {
  const ipfsNode = new IPFS();
  return new Promise((res, rej) => {
    ipfsNode.on('ready', async () => {
      res(ipfsNode)
    })
  })
}

export default async function getIPFS() {
  if (!ipfs) {
    ipfs = await initIPFS()
  }
  return ipfs
}
