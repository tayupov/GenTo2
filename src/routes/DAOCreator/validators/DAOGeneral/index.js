import { daoName, daoWebsite, daoDescription } from 'constants/validators';

export default function validateDAOGeneral() {
    const nameValue = document.getElementById(daoName).value;
    const websiteValue = document.getElementById(daoWebsite).value;
    const descriptionValue = document.getElementById(daoDescription).value;

    //TODO: validate
}
