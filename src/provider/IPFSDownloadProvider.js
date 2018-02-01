import getIPFS from 'utils/ipfs'
import promisify from 'utils/promisify'

export default async function downloadString(hash) {
  const ipfsNode = await getIPFS()
  const answers = await promisify(cb => ipfsNode.files.get(hash, cb))
  return answers[0].content.toString('utf8')
}

