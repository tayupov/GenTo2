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

function updateCreationState(event) {
  const steps = this.steps;
  const component = this.component;
  const step = getCurrentStep(steps);
  if (step) {
    const validator = step.validator;
    const result = validator();
    if (result) {
      component.setState({ ...result })
    }
  }

  // is second to last step
  if (step === steps[steps.length - 2]) {
    const createButton = document.getElementById('create-button');
    createButton.style.visibility = 'visible';
  }

  // is last step
  if (step === steps[steps.length - 1]) {
    const doing = document.querySelectorAll('.progtrckr-doing')[0];
    doing.classList.remove('progtrckr-doing');
    doing.classList.add('progtrckr-done');

    console.log(component.state)
  }
}

/*
  Hide the create button in case the current step is not the last step,
  or in case there are no steps in the "doing" state
*/
function handlePrevButton(event) {
  const steps = this.steps;
  const step = getCurrentStep(steps);

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