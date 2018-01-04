import { DAONAME, DAOWEBSITE, DAODESCRIPTION } from 'constants/validators';

export default function validateDAOGeneral() {
    const nameValue = document.getElementById(DAONAME).value;
    const websiteValue = document.getElementById(DAOWEBSITE).value;
    const descriptionValue = document.getElementById(DAODESCRIPTION).value;

    //TODO: validate

    return {
        name: nameValue,
        website: websiteValue,
        description: descriptionValue
    }
}
