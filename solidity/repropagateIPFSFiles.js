
let ipfs
const yaml = require('js-yaml');
const IPFS = require("ipfs")
const http = require('http');
const fs = require('fs');
const daosData = yaml.safeLoad(fs.readFileSync('./migrationsToyData/daos.yml', 'utf8')).DAOs;

async function repropagate() {
  for (let i=0; i<daosData.length; i++) {
    console.log(await uploadToIpfs(daosData[i].description))
  }
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
