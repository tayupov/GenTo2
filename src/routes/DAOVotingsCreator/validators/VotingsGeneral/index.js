import { VOTINGNAME, VOTINGCATEGORY, VOTINGDESCRIPTION } from 'constants/validators';

export default function validateDAOGeneral() {
  const nameValue = document.getElementById(VOTINGNAME).value;
  const categoryValue = document.getElementById(VOTINGCATEGORY).value;
  const descriptionValue = document.getElementById(VOTINGDESCRIPTION).value;

  //TODO: validate
  return {
    name: nameValue,
    category: categoryValue,
    description: descriptionValue
  }
}