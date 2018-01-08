import { DAONAME, DAOWEBSITE, DAODESCRIPTION, DAOPROPOSAL } from 'constants/validators';
import buffer from 'buffer';

const getArrayBufferFromFile = (proposalFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsArrayBuffer(proposalFile)
  })
}

/* 
  An async function wraps the return value in a promise
*/
export default async function validateDAOGeneral() {
  const nameValue = document.getElementById(DAONAME).value;
  const websiteValue = document.getElementById(DAOWEBSITE).value;
  const descriptionValue = document.getElementById(DAODESCRIPTION).value;

  // prepare IPFS upload
  const proposalFile = document.getElementById(DAOPROPOSAL).files[0];
  if (!proposalFile) {
    return false;
  }
  const proposalArrayBuffer = await getArrayBufferFromFile(proposalFile);

  //TODO: validate
  return {
    name: nameValue,
    website: websiteValue,
    description: descriptionValue,
    proposalArrayBuffer: proposalArrayBuffer
  }
}

