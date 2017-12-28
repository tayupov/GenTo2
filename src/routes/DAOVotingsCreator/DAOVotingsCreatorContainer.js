import React from 'react';

import DAOVotingsCreator from './DAOVotingsCreator';

import web3 from 'utils/web3';
import steps from './steps'

export default class DAOVotingsCreatorContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
		const prevButton = document.getElementById('prev-button');
		prevButton.addEventListener('click', this.handlePrevButton);

		const nextButton = document.getElementById('next-button');
		nextButton.addEventListener('click', this.updateCreationState)

		const createButton = document.createElement('button');
		createButton.addEventListener('click', this.updateCreationState);

		const createButtonText = document.createTextNode('Create');
		createButton.appendChild(createButtonText);
		createButton.id = 'create-button';
		createButton.style.visibility = 'hidden';

		const footerButtons = document.getElementsByClassName('footer-buttons')[0];
		footerButtons.appendChild(createButton);
	}

	updateCreationState = (event) => {
		const step = this.getCurrentStep()
		const validator = step.validator;
		// const result = validator();
		const result = null;
		if (result) {
				this.setState({ ...result })
		}

		if (step === steps[steps.length - 2]) {
			const createButton = document.getElementById('create-button');
			createButton.style.visibility = 'visible';
		}

		if (step === steps[steps.length - 1]) {
			const doing = document.querySelectorAll('.progtrckr-doing')[0];
			doing.classList.remove('progtrckr-doing');
			doing.classList.add('progtrckr-done');

			console.log(this.state)
		}
	}

	handlePrevButton = (event) => {
		const step = this.getCurrentStep()
		if (step === steps[steps.length - 1] ) {
			const createButton = document.getElementById('create-button');
			createButton.style.visibility = 'hidden';
		}
	}

	getCurrentStep = () => {
		const doing = document.querySelectorAll('.progtrckr-doing span')[0];
		const step = steps.find(step => step.name === doing.innerHTML);
		return step || null;
	}

	render() {

		return (
			<DAOVotingsCreator />
		)
	}
}
