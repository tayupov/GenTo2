import React, { Component } from 'react';

import {
    Modal,
    Button,
    Header,
    Icon
} from 'semantic-ui-react';

const modalComponent = ({
    modalOpen, modalState, handleClose, header
}) => (
    <Modal
        open={modalOpen}
        basic
        size='small'
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >
        <Header icon='browser' content="Voting" />
        <Modal.Content>
            {modalState === 'approve' && <h3>You are about to vote for the following proposal:</h3>}
            {modalState === 'decline' && <h3>You are about to vote against the following proposal:</h3>}
            <h1>{header}</h1>
        </Modal.Content>
        <Modal.Actions>
            <Button color='red' onClick={handleClose} inverted>
                No
            </Button>
            <Button color='green' onClick={handleClose} inverted>
                <Icon name='checkmark' /> Ok
            </Button>
        </Modal.Actions>
    </Modal>
)

export default modalComponent;