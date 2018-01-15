import React from 'react';
import { Container, Form, Input, TextArea, Select, Divider } from 'semantic-ui-react';
import { VOTINGNAME, VOTINGCATEGORY, VOTINGDESCRIPTION } from 'constants/validators';
import fieldsOfWork from 'constants/fieldsOfWork';

export default class General extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Container text>
        <Divider section hidden />
				<Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Enter the voting title</label>
              <Input type="text" name={VOTINGNAME} id={VOTINGNAME} size='small' />
            </Form.Field>
            <Form.Field>
              <label>Choose the field of work</label>
              <Select 
                id={VOTINGCATEGORY}
                name={VOTINGCATEGORY}
                compact
                required
                compact
                options={fieldsOfWork}
                defaultValue="organisational"
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Enter the voting description</label>
            <TextArea
              type="text"
              name={VOTINGDESCRIPTION}
              id={VOTINGDESCRIPTION}
              size='small'
            />
          </Form.Field>
				</Form>
        <Divider section hidden />
			</Container>
		)
	}
}
