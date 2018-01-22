import { Buffer } from 'buffer';
import getIPFS from 'utils/ipfs'
import promisify from 'utils/promisify'

async function downloadString(hash) {
  const ipfsNode = await getIPFS()
  const answers = await promisify(cb => ipfsNode.files.get(hash, cb))
  return answers[0].content.toString('utf8')
}

export default downloadString
