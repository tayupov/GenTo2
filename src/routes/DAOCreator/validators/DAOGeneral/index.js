import { DAONAME, DAODESCRIPTION, DAOPROPOSAL } from 'constants/validators';

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
  const descriptionValue = document.getElementById(DAODESCRIPTION).value;

  // prepare IPFS upload
  const proposalFile = document.getElementById(DAOPROPOSAL).files[0];
  const proposalArrayBuffer = proposalFile ? await getArrayBufferFromFile(proposalFile) : new ArrayBuffer();

  //TODO: validate
  return {
    name: nameValue,
    description: descriptionValue,
    proposalArrayBuffer: proposalArrayBuffer
  }
}

