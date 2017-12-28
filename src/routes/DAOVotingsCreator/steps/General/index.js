import React from 'react';
import { Container, Form, Input, TextArea, Select } from 'semantic-ui-react';

export default class General extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Container>
				<Form id="name-form">
					<Form.Field>
						<label>Enter the voting title</label>
						<Input
							type="text"
							name="pollName"
							id="pollName"
							size='small'
							/>
					</Form.Field>
					<Form.Field>
						<label>Choose the field of work</label>
						<Select
							id='pollCategory'
							name='pollCategory'
							compact
							required
							/>
					</Form.Field>
					<Form.Field>
						<label>Enter the voting description</label>
						<TextArea
							type="text"
							name="pollDescription"
							id="pollDescription"
							size='small'
							/>
					</Form.Field>
				</Form>
			</Container>
		)
	}
}
