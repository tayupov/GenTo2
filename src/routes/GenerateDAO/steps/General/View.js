import React from 'react';

import { Form, Input, TextArea, Container } from 'semantic-ui-react';

import InlineError from 'components/InlineError';

const styles = {
  root: {
    marginBottom: '1em'
  },
  firstLabel: {
    fontSize: '18px',
    marginTop: '3em',
    marginBottom: '0.8em',
    fontWeight: '300'
  },
  label: {
    fontSize: '18px',
    marginBottom: '1em',
    fontWeight: '300'
  },
  input: {
    width: '300px'
  },
  textArea: {
    width: '300px',
    fontSize: '13px',
    fontWeight: '100px'
  }
}

const View = ({
    onChange, data, errors
}) => (
    <Container style={styles.root}>
        <Form id="name-form">
            <Form.Field error={!!errors.daoName}>
                <label style={styles.firstLabel}>Give your DAO a name</label>
                <Input
                    type="text"
                    name="daoName"
                    id="daoName"
                    onChange={onChange}
                    size='small'
                    style={styles.input}
                    value={data.daoName}
                />
            </Form.Field>
            {errors.daoName && <InlineError text={errors.daoName} />}
            <Form.Field error={!!errors.daoWebsite}>
                <label style={styles.label}>Enter a URL to your Webpage</label>
                <Input
                    type="text"
                    name="daoWebsite"
                    id="daoWebsite"
                    onChange={onChange}
                    size='small'
                    style={styles.input}
                    value={data.daoWebsite}
                />
            </Form.Field>
            {errors.daoWebsite && <InlineError text={errors.daoWebsite} />}
            <Form.Field error={!!errors.daoDescription}>
                <label style={styles.label}>Describe the primary goal of your DAO</label>
                <TextArea
                    type="text-area"
                    name="daoDescription"
                    id="daoDescription"
                    onChange={onChange}
                    size='small'
                    style={styles.textArea}
                    value={data.daoDescription}
                />
            </Form.Field>
            {errors.daoDescription && <InlineError text={errors.daoDescription} />}
        </Form>
    </Container>
)

export default View;
