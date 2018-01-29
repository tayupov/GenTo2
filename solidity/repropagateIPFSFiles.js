
let ipfs
const IPFS = require("ipfs")
const http = require('http');

async function repropagate() {
  console.log(await uploadToIpfs("Theo software solutions. We rumble where you tumble."))
  console.log(await uploadToIpfs("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."))
  console.log(await uploadToIpfs("Block E."))
  ipfs.stop(() => process.exit())
}
repropagate()

async function uploadToIpfs(string) {
  const ipfsNode = await getIPFS()
  const content = Buffer.from(string);
  const files = await promisify(cb => ipfsNode.files.add({
    content
  }, cb))
  const hash = files[0].hash
  await callIPFSHash(hash)
  return hash
}

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

function promisify(inner) {
  return new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res);
    })
  )
}

function callIPFSHash(hash) {
  console.log(`fetching ipfs hash '${hash}' through gateway (might take a few seconds..)`)
  return new Promise((res, rej) => {
    http.get({
      host: 'ipfs.io',
      path: '/ipfs/' + hash
    }, function(response) {
      response.on('data', function() {
      });
      response.on('end', function() {
        res()
      });
    });
  })
}
