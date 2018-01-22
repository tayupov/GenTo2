import { Buffer } from 'buffer';
import getIPFS from 'utils/ipfs'
import promisify from 'utils/promisify'

async function upload(data) {
  const content = Buffer.from(data);
  const ipfsNode = await getIPFS()
  console.log("add file!")
  const files = await promisify(cb => ipfsNode.files.add({ content }, cb))
  return files[0].hash
}

export default upload
