/*
  To adjust StepZilla, the steps and the respective component which is holding the state (Container usually)
  are required as parameters. We pass those parameters as context to the "click" event listeners.
*/
export const adjustStepZilla = (steps, component) => {
  const bindObject = { steps, component }

  const prevButton = document.getElementById('prev-button');
  prevButton.addEventListener('click', handlePrevButton.bind(bindObject));

  const nextButton = document.getElementById('next-button');
  nextButton.addEventListener('click', updateCreationState.bind(bindObject))

  const createButton = document.createElement('button');
  createButton.addEventListener('click', updateCreationState.bind(bindObject));

  const createButtonText = document.createTextNode('Create');
  createButton.appendChild(createButtonText);
  createButton.id = 'create-button';
  createButton.style.visibility = 'hidden';

  const footerButtons = document.getElementsByClassName('footer-buttons')[0];
  footerButtons.appendChild(createButton);
}

/*
  Use an async function, because file reader works asynchronously
  and we want the return value of the file reader to be in component state
*/

async function updateCreationState(event) {
  const steps = this.steps;
  const component = this.component;
  const step = getCurrentStep(steps);
  if (step) {
    const validator = step.validator;
    const result = await validator();
    if (result) {
      component.setState({ ...result })
    }
  }

  if (step === steps[steps.length - 2]) {
    handleSecondToLastStep();
  }

  if (step === steps[steps.length - 1]) {
    handleLastStep(component);
  }
}

function handleSecondToLastStep() {
  const createButton = document.getElementById('create-button');
  createButton.style.visibility = 'visible';
}

function handleLastStep(component) {
  // fix fucking stepzilla
  const doing = document.querySelectorAll('.progtrckr-doing')[0];
  doing.classList.remove('progtrckr-doing');
  doing.classList.add('progtrckr-done');

  component.handleCreate()
}

function handlePrevButton(event) {
  const steps = this.steps;
  const step = getCurrentStep(steps);

  /*
  Hide the create button in case the current step is not the last step,
  or in case there are no steps in the "doing" state
*/
  if (!step || step === steps[steps.length - 1]) {
    const createButton = document.getElementById('create-button');
    createButton.style.visibility = 'hidden';
  }
}

/*
  When there are no .progtrckr-doing span elements, it means the form was submitted already.
 */
function getCurrentStep(steps) {
  const doing = document.querySelectorAll('.progtrckr-doing span')[0];
  const step = doing ? steps.find(step => step.name === doing.innerHTML) : null;
  return step;
}