import { Buffer } from 'buffer';
import getIPFS from 'utils/ipfs'
import promisify from 'utils/promisify'

export default async function upload(data) {
  const content = Buffer.from(data);
  const ipfsNode = await getIPFS()
  const files = await promisify(cb => ipfsNode.files.add({ content }, cb))
  return files[0].hash
}
