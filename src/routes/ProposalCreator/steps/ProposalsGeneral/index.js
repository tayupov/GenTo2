import React from 'react';
import { Container, Form, Input, TextArea, Select, Divider } from 'semantic-ui-react';
import { PROPOSALNAME, PROPOSALCATEGORY, PROPOSALDESCRIPTION, PROPOSALBENEFICIARY } from 'constants/validators';
import fieldsOfWork from 'constants/fieldsOfWork';

export default class General extends React.Component {

	render() {
		return (
			<Container text>
        <Divider section hidden />
				<Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Enter the proposal title</label>
              <Input type="text" name={PROPOSALNAME} id={PROPOSALNAME} size='small' />
            </Form.Field>
            <Form.Field>
              <label>Choose the beneficiary</label>
              <Input type="text" name={PROPOSALBENEFICIARY} id={PROPOSALBENEFICIARY} size='small' />
            </Form.Field>
            <Form.Field>
              <label>Choose the field of work</label>
              <Select 
                id={PROPOSALCATEGORY}
                name={PROPOSALCATEGORY}
                compact
                required
                options={fieldsOfWork}
                defaultValue="organisational"
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Enter the proposal description</label>
            <TextArea
              type="text"
              name={PROPOSALDESCRIPTION}
              id={PROPOSALDESCRIPTION}
              size='small'
            />
          </Form.Field>
				</Form>
        <Divider section hidden />
			</Container>
		)
	}
}
